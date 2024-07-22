'use client'

import "core-js";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"
import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardHeader,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { debug } from "console";
import ScheduleInfo from "./ScheduleInfo";

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
  return `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()} ${hour}:${minute}`;
}

let _modal: boolean = false;
const Calendar = () => {
  let doubleClick: Date | boolean = false;
  let calendarStart: Date, calendarEnd: Date;
  let [ events, setEvents ] = useState<Array<any>>();
  let [ schedule, setSchedule ] = useState({});
  let [ currentMonth, setCurrentMonth ] = useState();
  let [ modal, setModal ] = useState(_modal);

  const onDateClick = (event: any)=> {
    if(doubleClick && doubleClick === event.date.toISOString()) {
      doubleClick = false;
      console.log('doubleClick', dateToForm(event.date, true));
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

  useEffect(()=> {
    // console.log('useEffect');
    if(!events) {
      setEvents(exampleSchedule);
    }
  }, [events, currentMonth]);

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
          <strong>직원 관리</strong>
        </CCardHeader>
        <CCardBody>
          <FullCalendar
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
            titleRangeSeparator="~"
            eventChange={(evt)=>console.log(evt)}
            ref={(a)=>{
              // console.log(a.calendar.currentData.dateProfile.activeRange);
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

export default Calendar
