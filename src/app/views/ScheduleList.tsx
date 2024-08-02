'use client'

import "core-js";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import {
  CCard,
  CCardHeader,
  CCardBody,
  CCardText,
  CCardTitle,
  CFormSelect,
  CHeaderToggler,
  CForm,
  CCollapse,
  CInputGroupText,
  CButton,
  CButtonGroup,
  CButtonToolbar,
  CInputGroup,
  CDropdownToggle,
  CHeaderText,
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
  ColorLabel,
  filter,
  scheduleDisplay,
  resultList,
  resultMap,
  Dot,
  colorSetBadge,
} from "app/scheduleUtil"
import CIcon from "@coreui/icons-react";
import { cilCircle, cilMediaRecord } from "@coreui/icons";
import { getColor } from "@coreui/utils";
import { Role, ScheduleResult } from "@prisma/client";
import { useAppSelector } from "app/hooks";
import { UserInfo } from "app/store";

let _modal: boolean = false;
const ScheduleList = () => {
  let location = usePathname();
  let idMatch = location.match(/Schedule(?:List|Table)\/(\d+)/);
  let id = idMatch ? parseInt(idMatch[1]) : undefined;

  let doubleClick: Date | boolean = false;
  let [ events, setEvents ] = useState<Array<any>>();
  let [ schedule, setSchedule ] = useState({} as scheduleDisplay|{date: string, id: undefined}|{});
  let [ modal, setModal ] = useState(_modal);
  let [ range, setRange ] = useState({from: new Date(0), to: new Date(0)})
  let [ needRefresh, setNeedRefresh ] = useState(false);
  let [ filter, setFilter ] = useState({} as filter);
  let [ filterToggle, setFilterToggle ] = useState(true);
  let [ sales, setSales ] = useState('');
  let [ tm, setTm ] = useState('');
  let [ result, setResult ] = useState('');
  let calendarRef = useRef(null);
  const user: UserInfo = useAppSelector((state) => state.userInfo)

  console.log('range.from: ', range.from.getTime())

  const onDateClick = (event: any)=> {
    if(doubleClick && doubleClick === event.date.toISOString()) {
      doubleClick = false;
      setSchedule({
        id: undefined,
        date: dateToForm(event.date)
      });
      _modal = true;
      setModal(true);
    } else {
      doubleClick = event.date.toISOString();
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

  const onEventSubmit = (_schedule:schedule, modify?: boolean)=> {
    console.log(schedule);
    let request:{[x:string]:any} = {};
    let requestUrl = 'schedule/'
    if(modify) {
      requestUrl += 'update';
      request.id = (schedule as any).id;
      for(var key in schedule) {
        if((schedule as {[x:string]:any})[key] !== (_schedule as {[x:string]:any})[key]) {
          (request as {[x:string]:any})[key] = (_schedule as {[x:string]:any})[key];
        }
      }
    } else {
      requestUrl += 'create';
      request = _schedule;
    }
    apiRequest('post', requestUrl, request).then(({code, message})=> {
      if(code) return alert('생성 실패\n\n' + JSON.stringify(message));

      _modal = false;setModal(false);
      setNeedRefresh(!needRefresh);
      // setRange(range);
    })
  }

  const onEventRemove = (id: number)=> {
    apiRequest('post', 'schedule/remove', { id }).then(({code, message})=> {
      if(code) return alert('생성 실패\n\n' + JSON.stringify(message));

      _modal = false;setModal(false);
      setNeedRefresh(!needRefresh);
      // setRange(range);
    })
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

  const handleFilterChange = (e: any)=> {
    console.log(filter)
    console.log(e.target.name, e.target.value);
    const nextFilter = {
      ...filter,
    }
    setFilter({
      ...filter,
      [e.target.name]: e.target.value ? e.target.value : undefined,
    })
    console.log(filter)
  }

  useEffect(()=> {
    console.log('실행됨', range, needRefresh);
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
        prms.push(getSchedule(id).then(({schedule})=> {
          setSchedule(scheduleToDisplay(schedule));
        }));
      }

      prms.push(getScheduleList({
        from: dateToForm(range.from, dateToForm.WITHHOUR),
        to: dateToForm(range.to, dateToForm.WITHHOUR),
        filter,
      }).then((result: any)=> {
        if(result.code) return alert('error: ' + result.message)
        const scheduleList: Array<schedule> = result?.scheduleList;
        setEvents(scheduleList.map((schedule: schedule)=> {
          schedule.color = colorSet[schedule.result];
          schedule.title = schedule.company;
          return schedule;
        }));
      }));
    }
    prms.reduce((prevPrms, current) => {
      return prevPrms.then(()=>current);
    }, Promise.resolve())
  }, [range, filter, needRefresh]);

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
          <CCardTitle style={{display: 'inline-block'}}><strong>직원 관리</strong></CCardTitle>
          <CHeaderText style={{float: 'right'}}>
            <ColorLabel />
            <CDropdownToggle onClick={()=>setFilterToggle(!filterToggle)}>필터 {filterToggle ? "닫기" : "열기"}</CDropdownToggle>
          </CHeaderText>
        </CCardHeader>
        <CCardBody>
          <CCardText className="align-right">
            <CCollapse visible={filterToggle}>
              <CInputGroup style={{maxWidth: '600px'}}>
                {user.role === Role.ADMIN ?
                  <CFormSelect
                    value={filter.viewer}
                    name="viewer"
                    onChange={handleFilterChange}
                    options={[
                      {value: "", label: "담당TM"}
                    ].concat(user?.workers ? user?.workers?.filter((worker)=>worker.role === Role.TM)?.map((worker)=>({
                      value: worker.email, label: worker.name,
                    })) : [])}
                  ></CFormSelect>
                : null}
                {user.role !== Role.SALES ?
                  <CFormSelect
                    value={filter.manager}
                    name="manager"
                    onChange={handleFilterChange}
                    options={[
                      {value: "", label: "담당 영업"}
                    ].concat(user?.workers ? user?.workers?.filter((worker)=>worker.role === Role.SALES)?.map((worker)=>({
                      value: worker.email, label: worker.name,
                    })) : [])}
                  ></CFormSelect>
                : null}
                <CFormSelect
                  value={filter.result}
                  name="result"
                  onChange={handleFilterChange}
                >
                  <option value="">일정 상태</option>
                  {resultList.map((result)=>
                    <option color="primary" value={result}>
                      {resultMap[result]}
                    </option>
                  )}
                </CFormSelect>
                <CButton color="primary" onClick={(e)=>setFilter({} as filter)}>필터 초기화</CButton>
              </CInputGroup>
            </CCollapse>
          </CCardText>
          <CCardText></CCardText>
          <FullCalendar
            ref={calendarRef}
            // height={"100vh"}
            // themeSystem="bootstrap5"
            plugins={[
              dayGridPlugin,
              interactionPlugin,
            ]}
            eventDisplay="block"
            weekends={true}
            loading={(isLoading)=>{console.log(isLoading)}}
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

      <ScheduleInfo
        visible={modal}
        schedule={schedule}
        onSubmit={onEventSubmit}
        onRemove={onEventRemove}
        onClose={()=>{_modal = false;setModal(false);setSchedule({})}}
      />
    </>
  )
}

export default ScheduleList
