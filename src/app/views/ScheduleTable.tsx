"use client";

import "core-js";
import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CSpinner,
  CInputGroup,
  CInputGroupText,
  CBadge,
  CPagination,
  CPaginationItem,
  CCardFooter,
  CTooltip,
  CFormSelect,
  CCardText,
  CCardTitle,
  CHeaderText,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilArrowBottom, cilArrowTop, cilCalendar, cilPeople, cilPhone } from '@coreui/icons'
import { ColorLabel, colorSetBadge, dateToForm, filter, getScheduleList, orderDirection, orderItem, resultList, resultMap, schedule, scheduleDisplay, scheduleSortParam, scheduleToDisplay } from "app/scheduleUtil";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { Role } from "@prisma/client";
import { UserInfo } from "app/store";
import { useAppSelector } from "app/hooks";
import ScheduleInfo from "./ScheduleInfo";
import { apiRequest } from "app/api/apiRequest";

let _modal: boolean = false;

const headerList = [
  '일정ID',
  '상호',
  '일정',
  '담당TM',
  '담당영업',
  '상태',
]
const headerValue = [
  'id',
  'address',
  'date',
  'viewer',
  'manager',
  'result',
]
const tableItemMax = 10;
const month = 86400000 * 30;
const rangeLength = [
  month * 12 + 86400000 * 5,
  month * 6 + 86400000 *3,
  month * 3 + 86400000 *2,
  month,
];
const rangeButtonNames = [
  '1년',
  '6개월',
  '3개월',
  '1개월',
];
const defaultToDate = dateToForm(new Date(), dateToForm.NOHOUR);
const defaultFromDate = dateToForm(new Date(Date.now() - rangeLength[3]), dateToForm.NOHOUR);

let total = 0;
let pageMax = 0;

const checkFilter = (header: string)=> ['담당TM', '담당영업', '상태'].indexOf(header) === -1

const ScheduleTable = () => {
  let [ modal, setModal ] = useState(_modal);
  let [ scheduleList, setScheduleList ] = useState([] as Array<scheduleDisplay>)
  let [ schedule, setSchedule ] = useState(null as scheduleDisplay|{date: string, id: undefined}|null)
  let [ orderItem, setOrderItem] = useState('date' as orderItem);
  let [ orderDirection, setOrderDirection ] = useState('desc' as orderDirection);
  let [ filter, setFilter ] = useState({} as filter);
  let [ sales, setSales ] = useState('');
  let [ tm, setTm ] = useState('');
  let [ result, setResult ] = useState('');
  let [ currentPage, setCurrentPage ] = useState(1 as number);
  let [ from, setFrom ] = useState(defaultFromDate);
  let [ to, setTo ] = useState(defaultToDate);
  let [ range, setRange ] = useState(undefined as any);
  const user: UserInfo = useAppSelector((state) => state.userInfo)

  // pagination setting
  let minPage: number, maxPage: number;
  if(currentPage - 5 < 0) {
    minPage = 0;
    maxPage = pageMax / tableItemMax < 10 ? Math.ceil(pageMax / tableItemMax) : 10;
  } else if(pageMax / tableItemMax - currentPage < 5){
    minPage = Math.ceil(pageMax / tableItemMax) - 10;
    maxPage = Math.ceil(pageMax / tableItemMax);
  } else {
    minPage = currentPage - 5;
    maxPage = currentPage + 5;
  }

  useEffect(()=> {
    getScheduleList({
      orderItem,
      orderDirection,
      filter,
      currentAmount: (currentPage - 1) * tableItemMax,
      from: range?.from,
      to: range?.to,
    } as scheduleSortParam).then((result)=> {
      total = result?.total;
      pageMax = result?.pageMax;
      const scheduleList: Array<schedule> = result?.scheduleList;
      setScheduleList(scheduleList.map((schedule)=> scheduleToDisplay(schedule)));
    });
  }, [orderItem, orderDirection, filter, range, currentPage]);

  const onCloseModal = ()=> {
    _modal = false;
    setModal(false);
  }

  const RangeButton = ()=>rangeButtonNames.map((rangeButtonName, i)=>
    <CButton
      key={i}
      type="button"
      variant="outline"
      color="primary"
      onClick={()=> {
        setFrom(dateToForm(new Date(Date.now() - rangeLength[i]), dateToForm.NOHOUR));
      }}
    >{rangeButtonName}</CButton>
  )

  const handleClickHeader = (i: number)=> {
    if(!checkFilter(headerList[i]))
      return;

    const target = headerValue[i];
    if(orderItem === target)
      setOrderDirection(orderDirection === 'desc' ? 'asc' : 'desc');
    setOrderItem(headerValue[i] as orderItem);

  }

  const handleDatePickerChange = (e: any, b: any)=> {
    let _from;
    try {
      _from = e && new Date(e.toISOString());
    } catch(e) {}
    _from && setFrom(dateToForm(_from, dateToForm.NOHOUR))
  }

  const handleSearch = ()=> {
    setCurrentPage(1);
    setRange({
      from,
      to
    });
  }
  const handleReset = ()=> {
    setCurrentPage(1);
    setRange(undefined);
  }

  const handleRowClick = (schedule: scheduleDisplay)=> {
    setSchedule(schedule);
    _modal = true;setModal(true);
  }

  const DrawHeader = ({index, value}: {index: number, value: string})=> {
    let optionList;
    let formValue, setState;
    if(value === '담당영업') {
      formValue = sales;
      setState = setSales;
      optionList = user?.workers?.filter((worker)=>worker.role === Role.SALES)?.map((item: any, i)=>
        <option key={i} value={item.email}>{item.name}</option>
      )
    } else if (value === '담당TM') {
      formValue = tm;
      setState = setTm;
      optionList = user?.workers?.filter((worker)=>worker.role === Role.TM).map((item: any, i)=>
        <option key={i} value={item.email}>{item.name}</option>
      )
    } else if (value === '상태') {
      formValue = result;
      setState = setResult;
      optionList = resultList.map((item, i)=>
        <option key={i} value={item}>{resultMap[item]}</option>
      )
    } else {
      setState = ()=>{};
    }

    if(!optionList) return (<>Error</>)

    return (<>
      <CFormSelect
        key={index}
        value={formValue}
        onChange={(e)=>{
          let nextState = {
            ...filter
          };
          
          if(e.target.value === '') {
            nextState[headerValue[index]] = undefined;
            setState(e.target.value);
            setFilter(nextState);
            setCurrentPage(1);
          } else {
            nextState[headerValue[index]] = e.target.value;
            setState(e.target.value);
            setFilter(nextState);
            setCurrentPage(1);
          }
        }}
      >
        <option value={""}>{headerList[index]}</option>
        {optionList}
      </CFormSelect>
    </>)
  }
  return (
    <>
      <LocalizationProvider
        dateAdapter={AdapterDayjs}
        adapterLocale="ko"
      >
        <CCard className="mb-4">
          <CCardHeader>
            <CCardTitle style={{display: 'inline-block'}}><strong>계약 관리</strong></CCardTitle>
            <CHeaderText style={{float: 'right'}}><ColorLabel /></CHeaderText>
          </CCardHeader>
          <CCardBody>
            <CTable >
              <CTableHead>
                <CTableRow>
                  {/*customClassName="nav-icon"*/}
                  {headerList.map((headerName, i)=>
                    <CTooltip 
                      key={i}
                      content={`클릭하시면 ${
                        checkFilter(headerName) ?
                        "정렬됩니다.":
                        "필터를 선택할 수 있습니다."}`
                      }
                      // placement="auto"
                      offset={[0,0]}
                    >
                      <CTableHeaderCell
                        key={i}
                        scope="col"
                        onClick={checkFilter(headerName) ?
                          ()=>handleClickHeader(i) :
                          undefined
                        }
                      >
                        {checkFilter(headerName) ? headerName :
                          <DrawHeader
                            key={i}
                            index={i}
                            value={headerName}
                          />
                        }
                        {headerValue[i] === orderItem ?
                          <CIcon icon={orderDirection === 'desc' ? cilArrowBottom : cilArrowTop} />
                        : null}
                      </CTableHeaderCell>
                    </CTooltip>
                  )}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {
                scheduleList ? scheduleList.map((schedule, i)=> {
                  return (
                    <CTableRow key={i} onClick={()=>handleRowClick(schedule)}>
                      <CTableDataCell>{schedule.id}</CTableDataCell>
                      <CTableDataCell>{schedule.company}</CTableDataCell>
                      <CTableDataCell>{dateToForm(new Date(schedule.date), dateToForm.NOHOUR)}</CTableDataCell>
                      <CTableDataCell>{schedule.viewer} <CIcon icon={cilPhone}/></CTableDataCell>
                      <CTableDataCell>{schedule.managerName} <CIcon icon={cilPeople}/></CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={colorSetBadge[schedule.result]}>{resultMap[schedule.result]}</CBadge>
                      </CTableDataCell>
                    </CTableRow>
                  )
                })
                :
                <div className="pt-3 page-loading text-center">
                  <CSpinner color="primary" variant="grow" />
                </div>
                }
              </CTableBody>
            </CTable>
          </CCardBody>
          <CCardFooter>
            <CInputGroup className="align-right">
              <RangeButton/>
              <CInputGroupText>
                <CIcon icon={cilCalendar} />
              </CInputGroupText>
              <DatePicker
                format="YYYY-MM-DD"
                timezone="system"
                value={from ? dayjs(from) : dayjs(new Date(0))}
                onChange={handleDatePickerChange}
              ></DatePicker>
              <CInputGroupText>~</CInputGroupText>
              <DatePicker
                format="YYYY-MM-DD"
                timezone="system"
                value={to ? dayjs(to) : dayjs(new Date(0))}
                onChange={handleDatePickerChange}
              ></DatePicker>
              <CButton
                type="button"
                // variant="outline"
                color="primary"
                onClick={handleSearch}
              >검색</CButton>
              <CButton
                type="button"
                // variant="outline"
                color="primary"
                onClick={handleReset}
              >기간 해제</CButton>
            </CInputGroup>
            <CPagination
              align="center"
              color="primary"
            >
              <CPaginationItem
                aria-label="Previous"
                disabled={currentPage === 1}
                onClick={()=>setCurrentPage(--currentPage)}
              >
                <span aria-hidden="true">&laquo;</span>
              </CPaginationItem>
              {Array(maxPage - minPage).fill('').map((page, i)=> 
                <CPaginationItem
                  key={i}
                  active={currentPage === minPage+i+1}
                  onClick={()=>setCurrentPage(minPage+i+1)}
                >{minPage+i+1}</CPaginationItem>
              )}
              <CPaginationItem
                aria-label="Next"
                disabled={currentPage===Math.ceil(pageMax/tableItemMax)}
                onClick={()=>setCurrentPage(++currentPage)}
              >
                <span aria-hidden="true">&raquo;</span>
              </CPaginationItem>
            </CPagination>
          </CCardFooter>
        </CCard>
        <ScheduleInfo
          visible={modal}
          schedule={schedule}
          onSubmit={()=>{}}
          onClose={()=>{_modal = false;setModal(false);setSchedule(null)}}
        />
      </LocalizationProvider>
    </>
  )
}
  
export default ScheduleTable;
