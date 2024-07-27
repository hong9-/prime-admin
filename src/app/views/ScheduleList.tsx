'use client'

import "core-js";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"
import React, { useEffect, useRef, useState } from 'react'
import {
  CButton,
  CCard,
  CCardHeader,
  CCardBody,
  CSpinner,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import ScheduleInfo from "./ScheduleInfo";
import { apiRequest } from "app/api/apiRequest";
import { CalendarApi } from "@fullcalendar/core/index.js";
import { usePathname } from "next/navigation";
import {
  schedule,
  colorSet,
  dateToForm,
  getSchedule,
  getScheduleList,
  scheduleToDisplay,
} from "app/scheduleUtil"

// 담당자 받아오기(서버)
// 달력 전체 날짜 받아오기(클라이언트)
// 스케줄 받아오기(서버)
// 담당자 등록하기(서버)

let _modal: boolean = false;
const ScheduleList = () => {
  let location = usePathname();
  let idMatch = location.match(/Schedule(?:List|Table)\/(\d+)/);
  let id = idMatch ? parseInt(idMatch[1]) : undefined;

  let doubleClick: Date | boolean = false;
  let [ events, setEvents ] = useState<Array<any>>();
  let [ schedule, setSchedule ] = useState({});
  let [ currentMonth, setCurrentMonth ] = useState();
  let [ modal, setModal ] = useState(_modal);
  let calendarRef = useRef(null);
  let [ range, setRange ] = useState({from: new Date(0), to: new Date(0)})

  const onDateClick = (event: any)=> {
    if(doubleClick && doubleClick === event.date.toISOString()) {
      doubleClick = false;
      setSchedule({
        date: dateToForm(event.date, true)
      });
      _modal = true;
      setModal(true);
    } else {
      doubleClick = event.date.toISOString();
      // console.log(doubleClick);
      setTimeout(()=> {
        doubleClick = false;
      }, 300)
    }
  };

  const onEventClick = (scheduleClick: any)=> {
    let {event} = scheduleClick;
    if(events) {
      let schedule: any = events.find((_schedule:any)=> _schedule.id == event.id);
      setSchedule(scheduleToDisplay(schedule));
      _modal = true;setModal(true);
    }
  }

  const onEventSubmit = (schedule:schedule)=> {
    console.log(schedule);
  }

  let calendarTool: CalendarApi = (calendarRef.current as any)?.calendar;
  const onCalendarButton = (e: MouseEvent)=> {
    let buttonName: 'prev'|'next' = (e.currentTarget as HTMLElement).title as 'prev'|'next';
    calendarTool[buttonName]();
    calendarTool && setRange({
      from: calendarTool?.view.activeStart as Date,
      to: calendarTool?.view.activeEnd as Date,
    })
    return true;
  }

  useEffect(()=> {
    if(!range.from.getTime() && calendarRef.current) {
      calendarTool = (calendarRef.current as any)?.calendar;
      setRange({
        from: calendarTool.view.activeStart as Date,
        to: calendarTool.view.activeEnd as Date,
      })
    }
    let prms = [];
    if(range.from.getTime()) {
      if(id) {
        prms.push(getSchedule(id));
      }

      prms.push(getScheduleList(
        dateToForm(range.from, true).replace(' 14:0', ''),
        dateToForm(range.to, true).replace(' 14:0', ''),
      ).then((scheduleList: Array<schedule>)=> {
        scheduleList.map((schedule: schedule)=> {
          schedule.color = colorSet[schedule.result];
          schedule.title = schedule.address;
        })
      }));
    }
    prms.reduce((prevPrms, current) => {
      return prevPrms.then(()=>current);
    }, Promise.resolve())
  }, [range]);

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
          <strong>직원 관리</strong>
        </CCardHeader>
        <CCardBody>
          <FullCalendar
            ref={calendarRef}
            height={"100vh"}
            // themeSystem="bootstrap5"
            plugins={[
              dayGridPlugin,
              interactionPlugin,
            ]}
            eventDisplay="block"
            weekends={true}
            events={events}
            dateClick={onDateClick}
            eventClick={onEventClick}
            titleFormat={{
              month: 'numeric',
              day: 'numeric',
            }}
            navLinks={false}
            titleRangeSeparator="~"
            // eventChange={(evt)=>console.log(evt)}
            customButtons={{
              postUser: {
                text: '일정등록',
                click: ()=>{
                  _modal = true;
                  setModal(true);
                },
              },
              prev: {
                // hint: '이전 달 보기',
                text: 'prev',
                click: onCalendarButton,
              },
              next: {
                // hint: '다음 달 보기',
                text: 'next',
                click: onCalendarButton,
              }
            }}
            headerToolbar={{
              left: 'title',
              center: '',
              right: 'postUser prev,next',
            }}
          />
        </CCardBody>
      </CCard>

      <div className="align-right">
        <CButton
          color="primary"
          onClick={()=>{_modal = true;setModal(true);}
        }>일정 등록</CButton>
      </div>

      <ScheduleInfo
        visible={modal}
        schedule={schedule}
        onSubmit={onEventSubmit}
        onClose={()=>{_modal = false;setModal(false);setSchedule({})}}
      />
    </>
  )
}

export default ScheduleList
