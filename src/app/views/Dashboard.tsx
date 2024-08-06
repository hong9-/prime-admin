import React, { useEffect, useRef, useState } from 'react'
import classNames from 'classnames'

import {
  CCard,
  CCardBody,
  CCardHeader,
  CCardText,
  CCardTitle,
  // CAvatar,
  // CButton,
  // CButtonGroup,
  // CCard,
  // CCardBody,
  // CCardFooter,
  // CCardHeader,
  CCol,
  // CProgress,
  CRow,
  // CTable,
  // CTableBody,
  // CTableDataCell,
  // CTableHead,
  // CTableHeaderCell,
  // CTableRow,
  // CChartLine,
  CWidgetStatsA,
  CWidgetStatsD,
  // CWidgetStatsB,
  // CWidgetStatsC,
  // CWidgetStatsD,
  // CWidgetStatsE,
  // CWidgetStatsF,
} from '@coreui/react'
import {
  CChartBar,
  CChartDoughnut,
  CChartLine,
  CChartPie,
  CChartPolarArea,
  CChartRadar,
} from '@coreui/react-chartjs'
import { getStyle } from '@coreui/utils'
import CIcon from '@coreui/icons-react'
import {
  cilHandshake,
  cilCalendarCheck,
} from '@coreui/icons'
import { apiRequest } from 'app/api/apiRequest'
import { CWidgetStatsAProps } from '@coreui/react/dist/esm/components/widgets/CWidgetStatsA'
import { Role } from '@prisma/client'
import { UserInfo } from 'app/store'
import { useAppDispatch, useAppSelector, useAppStore } from 'app/hooks'
import { filter } from 'app/scheduleUtil'
import { useRouter } from 'next/navigation'

// import avatar1 from 'app/assets/images/avatars/1.jpg'
// import avatar2 from 'app/assets/images/avatars/2.jpg'
// import avatar3 from 'app/assets/images/avatars/3.jpg'
// import avatar4 from 'app/assets/images/avatars/4.jpg'
// import avatar5 from 'app/assets/images/avatars/5.jpg'
// import avatar6 from 'app/assets/images/avatars/6.jpg'

interface maxPerson{
  number: number,
  name: string,
}

interface summary {
  total: number,
  contractTotal: number,
  salesMax: maxPerson,
  tmMax: maxPerson,
  totalGraphArray: Array<number>,
  contractGraphArray: Array<number>,
}

interface customWidgetProp {
  color: string,
  label: string|number,
  pointLabel: string,
  showDot: boolean,
  graphLabel: Array<string>,
  graphData: Array<number>,
  fill?: boolean,
}

const CustomWidget = ({ color, label, pointLabel, showDot, graphLabel, graphData, fill, ...props }: customWidgetProp & CWidgetStatsAProps)=> {
  return (<CWidgetStatsA
    color={color}
    value={
      <>
        {label}
        <span className="fs-6 fw-normal">
          {" 회"}
        </span>
      </>
    }
    chart={<CChartLine
      className="mt-3 mx-3"
      style={{ height: '70px' }}
      data={{
        labels: graphLabel,
        datasets: [
          {
            label: pointLabel,
            backgroundColor: 'transparent',
            borderColor: 'rgba(255,255,255,.55)',
            pointBackgroundColor: getStyle('--cui-'+color),
            data: graphData,
            fill,
          },
        ],
      }}
      options={{
        plugins: {
          legend: {
            display: false,
          },
        },
        maintainAspectRatio: false,
        scales: {
          x: {
            border: {
              display: false,
            },
            grid: {
              display: false,
              // drawBorder: false,
            },
            ticks: {
              display: false,
            },
          },
          y: {
            min: Math.min.apply(null, graphData)-1,
            max: Math.max.apply(null, graphData)+1,
            display: false,
            grid: {
              display: false,
            },
            ticks: {
              display: false,
            },
          },
        },
        elements: {
          line: {
            borderWidth: 1,
            tension: 0.4,
          },
          point: {
            radius: showDot ? 4 : 0,
            hitRadius: 10,
            hoverRadius: 4,
          },
        },
      }}
    />}
    {...props}
  />)
}

const InfoCard = ({color, icon, values, ...props}: {color: string, icon: string[], values: Array<{title: string, value: number|string}>, [x:string]: any})=>(
  <CCol sm={6} xl={4} xxl={3}>
    <CWidgetStatsD
      {...props}
      className="mb-4"
      color={color}
      icon={<CIcon icon={icon} height={52} className="my-4 text-white" />}
      values={values}
    />
  </CCol>
)


const Dashboard = () => {
  const [ info, setInfo ] = useState({
    currentWeekInfo: {} as summary,
    lastWeekInfo: {} as summary,
    currentMonthInfo: {} as summary,
    lastMonthInfo: {} as summary,
    currentWeekTotal: 0,
    lastWeekTotal: 0,
    yesterdayTotal: 0,
    todayTotal: 0,
  });
  const router = useRouter();
  const user: UserInfo = useAppSelector((state) => state.userInfo)
  const dispatch = useAppDispatch();

  useEffect(()=> {
    apiRequest('post', 'summary', {}).then((res)=> {
      const {
        code,
        currentWeekInfo,
        lastWeekInfo,
        currentMonthInfo,
        lastMonthInfo,
        currentWeekTotal,
        lastWeekTotal,
        yesterdayTotal,
        todayTotal,
      } = res;

      if(code) {
        return alert()
      }
      setInfo({
        currentWeekInfo,
        lastWeekInfo,
        currentMonthInfo,
        lastMonthInfo,
        currentWeekTotal,
        lastWeekTotal,
        yesterdayTotal,
        todayTotal,
      })
    });
  }, [])

  const handleClickCard = (name?: string)=> {
    if(name) {
      let manager = user?.workers?.find((worker)=>worker.name === name && worker.role === Role.SALES)
      let viewer = user?.workers?.find((worker)=>worker.name === name && worker.role === Role.TM)
      if(manager || viewer) {
        dispatch({ type: 'set', filter: {
          manager: manager?.email,
          viewer: viewer?.email,
        }})
      }
    }

    router.push('/Schedule'+(user?.role === Role.ADMIN ? 'Table' : 'List'));
  }

  if(user.role === Role.ADMIN) {
    return (
      <>
        <CCard>
          <CCardHeader><CCardTitle><strong>일주일</strong> 단위 요약</CCardTitle></CCardHeader>
          <CCardBody>
            <CRow className="mb-4" xs={{ gutter: 4 }}>
              
              <CCol sm={6} xl={4} xxl={3}>
                <CustomWidget 
                  pointLabel="일정 등록"
                  color="primary"
                  label={info.currentWeekInfo.total}
                  title="일정 등록"
                  showDot={true}
                  graphData={info.currentWeekInfo.totalGraphArray}
                  graphLabel={['월','화','수','목','금','토','일'].map((a)=>a+'요일')}
                />
              </CCol>
              <CCol sm={6} xl={4} xxl={3}>
                <CustomWidget 
                  pointLabel="계약 완료"
                  color="success"
                  label={info.currentWeekInfo.contractTotal}
                  title="계약"
                  showDot={true}
                  graphData={info.currentWeekInfo.contractGraphArray}
                  graphLabel={['월','화','수','목','금','토','일'].map((a)=>a+'요일')}
                />
              </CCol>
              <CCol sm={6} xl={4} xxl={3}>
                <CustomWidget 
                  pointLabel="일정 등록(지난 주)"
                  color="primary"
                  label={info.lastWeekInfo.total}
                  title="일정 등록(지난 주)"
                  showDot={true}
                  graphData={info.lastWeekInfo.totalGraphArray}
                  graphLabel={['월','화','수','목','금','토','일'].map((a)=>a+'요일')}
                />
              </CCol>
              <CCol sm={6} xl={4} xxl={3}>
                <CustomWidget 
                  pointLabel="계약 완료(지난 주)"
                  color="success"
                  label={info.lastWeekInfo.contractTotal}
                  title="계약(지난 주)"
                  showDot={true}
                  graphData={info.lastWeekInfo.contractGraphArray}
                  graphLabel={['월','화','수','목','금','토','일'].map((a)=>a+'요일')}
                />
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
        <CCard>
          <CCardHeader><CCardTitle>최근 <strong>한 달</strong> 단위로 요약해서 보여줍니다.</CCardTitle></CCardHeader>
          <CCardBody>
            <CRow className="mb-4" xs={{ gutter: 4 }}>
              <CCol sm={6} xl={4} xxl={3}>
                <CustomWidget 
                  pointLabel="일정 등록"
                  color="primary"
                  label={info.currentMonthInfo.total}
                  title="일정 등록"
                  showDot={false}
                  graphData={info.currentMonthInfo.totalGraphArray}
                  graphLabel={Array(info.currentMonthInfo.totalGraphArray?.length).fill('')}
                  fill={true}
                />
              </CCol>
              <CCol sm={6} xl={4} xxl={3}>
                <CustomWidget 
                  pointLabel="계약 완료"
                  color="success"
                  label={info.currentMonthInfo.contractTotal}
                  title="계약"
                  showDot={false}
                  graphData={info.currentMonthInfo.contractGraphArray}
                  graphLabel={Array(info.currentMonthInfo.totalGraphArray?.length).fill('')}
                  fill={true}
                />
              </CCol>
              <CCol sm={6} xl={4} xxl={3}>
                <CustomWidget 
                  pointLabel="일정 등록(지난 달)"
                  color="primary"
                  label={info.lastMonthInfo.total}
                  title="일정 등록(지난 달)"
                  showDot={false}
                  graphData={info.lastMonthInfo.totalGraphArray}
                  graphLabel={Array(info.lastMonthInfo.totalGraphArray?.length).fill('')}
                  fill={true}
                />
              </CCol>
              <CCol sm={6} xl={4} xxl={3}>
                <CustomWidget 
                  pointLabel="계약 완료(지난 달)"
                  color="success"
                  label={info.lastMonthInfo.contractTotal}
                  title="계약(지난 달)"
                  showDot={false}
                  graphData={info.lastMonthInfo.contractGraphArray}
                  graphLabel={Array(info.lastMonthInfo.totalGraphArray?.length).fill('')}
                  fill={true}
                />
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
        <CCard>
          <CCardHeader>등록 현황</CCardHeader>
          <CCardBody>
            <CRow className="mb-4" xs={{ gutter: 4 }}>
              <InfoCard
                color="warning"
                icon={cilHandshake}
                values={[
                  {title: '지난 주', value: info.lastWeekInfo.salesMax?.name},
                  {title: '계약', value: info.lastWeekInfo.salesMax?.number}
                ]}
                onClick={()=>handleClickCard(info.lastWeekInfo.salesMax.name)}
              />
              <InfoCard
                color="warning"
                icon={cilHandshake}
                values={[
                  {title: '지난 달', value: info.lastMonthInfo.salesMax?.name},
                  {title: '계약', value: info.lastMonthInfo.salesMax?.number}
                ]}
                onClick={()=>handleClickCard(info.lastMonthInfo.salesMax.name)}
              />
              <InfoCard
                color="danger"
                icon={cilCalendarCheck}
                values={[
                  {title: '지난 주', value: info.lastWeekInfo.tmMax?.name},
                  {title: '일정 등록', value: info.lastWeekInfo.tmMax?.number}
                ]}
                onClick={()=>handleClickCard(info.lastWeekInfo.tmMax.name)}
              />
              <InfoCard
                color="danger"
                icon={cilCalendarCheck}
                values={[
                  {title: '지난 달', value: info.lastMonthInfo.tmMax?.name},
                  {title: '일정 등록', value: info.lastMonthInfo.tmMax?.number}
                ]}
                onClick={()=>handleClickCard(info.lastMonthInfo.tmMax.name)}
              />
            </CRow>
          </CCardBody>
        </CCard>
      </>
    )
  } else if (user.role === Role.TM) {
    return <CCard>
      <CCardHeader>등록 현황</CCardHeader>
      <CCardBody>
        <CRow className="mb-4" xs={{ gutter: 4 }}>
          <InfoCard
            color="info"
            icon={cilHandshake}
            values={[
              {title: '오늘', value: info.todayTotal},
              {title: '어제', value: info.yesterdayTotal},
            ]}
            onClick={()=>handleClickCard()}
          />
          <InfoCard
            color="primary"
            icon={cilCalendarCheck}
            values={[
              {title: '이번 주', value: info.currentWeekTotal},
              {title: '지난 주', value: info.lastWeekTotal},
            ]}
            onClick={()=>handleClickCard()}
          />
        </CRow>
      </CCardBody>
    </CCard>
  } else if (user.role === Role.SALES) {
    return <CCard>
      <CCardHeader><CCardTitle><strong>계약 현황</strong></CCardTitle></CCardHeader>
      <CCardBody>
        <CRow className="mb-4" xs={{ gutter: 4 }}>
          <InfoCard
            color="info"
            icon={cilHandshake}
            values={[
              {title: '오늘', value: info.todayTotal},
              {title: '어제', value: info.yesterdayTotal},
            ]}
            onClick={()=>handleClickCard()}
          />
          <InfoCard
            color="primary"
            icon={cilCalendarCheck}
            values={[
              {title: '이번 주', value: info.currentWeekTotal},
              {title: '지난 주', value: info.lastWeekTotal},
            ]}
            onClick={()=>handleClickCard()}
          />
        </CRow>
      </CCardBody>
    </CCard>
  }
}

export default Dashboard
