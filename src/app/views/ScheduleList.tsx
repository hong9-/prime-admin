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

interface schedule {
  id: string;
  title: string;
  color: string;
  date: string;
}

const exampleSchedule = [
  {
    id: 'abcde',
    title: 'hi',
    date: '2024-06-30 08:30',
    color: 'red',
    manager: '김대리',
    address: '서울시 중랑구 면목동',
  }, {
    id: 'abcde',
    title: 'hi',
    date: '2024-07-11 12:00',
    color: '#0000ff',
    manager: '이대리',
    address: '서울시 중랑구 망우동',
  }, {
    id: 'fghij',
    title: '서울시 광진구 중곡동',
    date: '2024-07-11 09:00',
    color: 'green',
    manager: '박과장',
    address: '서울시 광진구 중곡동',
  }, {
    id: 'qwert',
    title: 'hello',
    date: '2024-07-11 15:30',
    color: 'cyan',
    manager: '박과장',
    address: '서울시 동대문구 장안동',
  },
];

export const dateToForm = (date:Date, isEmptyHour?: boolean)=> {
  let hour:number = isEmptyHour ? 14 : date.getHours();
  let minute:number = isEmptyHour ? 0 : date.getMinutes();
  return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${hour}:${minute}`;
}

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
  // let sample = new Date();
  // let today = new Date(sample.getFullYear()+'/'+(sample.getMonth()+1)+'/'+sample.getDate());

  // today.setDate(1);
  // today.getDay()
  // let 

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
      let schedule: any = events.find((_schedule:any)=> _schedule.id === event.id);
      setSchedule(schedule);
      _modal = true;setModal(true);
    }
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
    if(!events) {
      setEvents(exampleSchedule);
    }
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
        prms.push(new Promise((resolve, reject)=> {
          apiRequest('get', 'schedule/'+id).then((res)=> {
            let {code, schedule} = res;
            if(code !== 0) {
              alert(JSON.stringify(res));
              return;
            }
      
            setSchedule(schedule);
            _modal = true;setModal(true);
          }).then(resolve);
        }));
      }
      let request = {
        from: dateToForm(range.from, true).replace(' 14:0', ''),
        to: dateToForm(range.to, true).replace(' 14:0', ''),
      }
      prms.push(new Promise((resolve, reject)=> {
        apiRequest('get', 'schedule', request).then((res)=> {
          let {code, scheduleList} = res;
          if(code !== 0) {
            alert(JSON.stringify(res));
            return;
          }
    
          setEvents(scheduleList);
        }).then(resolve);
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
              right: 'postUser today prev,next',
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
        onClose={()=>{_modal = false;setModal(false);setSchedule({})}}
      />
    </>
  )
}

export default ScheduleList
