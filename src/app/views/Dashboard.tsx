import React, { useEffect, useRef, useState } from 'react'
import classNames from 'classnames'

import {
  CCard,
  CCardBody,
  CCardHeader,
  CCardText,
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
  cilArrowBottom,
  // cibCcAmex,
  // cibCcApplePay,
  // cibCcMastercard,
  // cibCcPaypal,
  // cibCcStripe,
  // cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  // cifBr,
  // cifEs,
  // cifFr,
  // cifIn,
  // cifPl,
  // cifUs,
  cibTwitter,
  // cilCloudDownload,
  // cilPeople,
  cilUser,
  cilUserFemale,
  cibSublimeText,
} from '@coreui/icons'
import { apiRequest } from 'app/api/apiRequest'
import { CWidgetStatsAProps } from '@coreui/react/dist/esm/components/widgets/CWidgetStatsA'

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

const Dashboard = () => {
  const [ info, setInfo ] = useState({
    currentWeekInfo: {} as summary,
    lastWeekInfo: {} as summary,
    currentMonthInfo: {} as summary,
    lastMonthInfo: {} as summary,
  });
  const progressExample = [
    { title: 'Visits', value: '29.703 Users', percent: 40, color: 'success' },
    { title: 'Unique', value: '24.093 Users', percent: 20, color: 'info' },
    { title: 'Pageviews', value: '78.706 Views', percent: 60, color: 'warning' },
    { title: 'New Users', value: '22.123 Users', percent: 80, color: 'danger' },
    { title: 'Bounce Rate', value: 'Average Rate', percent: 40.15, color: 'primary' },
  ]

  const progressGroupExample1 = [
    { title: 'Monday', value1: 34, value2: 78 },
    { title: 'Tuesday', value1: 56, value2: 94 },
    { title: 'Wednesday', value1: 12, value2: 67 },
    { title: 'Thursday', value1: 43, value2: 91 },
    { title: 'Friday', value1: 22, value2: 73 },
    { title: 'Saturday', value1: 53, value2: 82 },
    { title: 'Sunday', value1: 9, value2: 69 },
  ]

  const progressGroupExample2 = [
    { title: 'Male', icon: cilUser, value: 53 },
    { title: 'Female', icon: cilUserFemale, value: 43 },
  ]

  const progressGroupExample3 = [
    { title: 'Organic Search', icon: cibGoogle, percent: 56, value: '191,235' },
    { title: 'Facebook', icon: cibFacebook, percent: 15, value: '51,223' },
    { title: 'Twitter', icon: cibTwitter, percent: 11, value: '37,564' },
    { title: 'LinkedIn', icon: cibLinkedin, percent: 8, value: '27,319' },
  ]

  const widgetChartRef1 = useRef(null)

  useEffect(()=> {
    apiRequest('post', 'summary').then((res)=> {
      const {
        code,
        currentWeekInfo,
        lastWeekInfo,
        currentMonthInfo,
        lastMonthInfo,
      } = res;
      if(code) {
        return alert()
      }
      setInfo({
        currentWeekInfo,
        lastWeekInfo,
        currentMonthInfo,
        lastMonthInfo,
      })
      console.log(res);
    });
  }, [])

  const CustomWidget = ({ color, label, pointLabel, showDot, graphLabel, graphData, fill, ...props }: customWidgetProp & CWidgetStatsAProps)=> {
    console.log(props);
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
        ref={widgetChartRef1}
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
  return (
    <>
      <CCard>
        <CCardHeader><CCardText><h5><strong>일주일</strong> 단위 요약</h5></CCardText></CCardHeader>
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
      {'&nbsp;'}
      <CCard>
        <CCardHeader><CCardText><h5>최근 <strong>한 달</strong> 단위로 요약해서 보여줍니다.</h5></CCardText></CCardHeader>
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
        <CCardHeader>최고 실적</CCardHeader>
        <CCardBody>
          <CRow className="mb-4" xs={{ gutter: 4 }}>
            <CCol sm={6} xl={4} xxl={3}>
              <CWidgetStatsD
                className="mb-4"
                color="warning"
                icon={<CIcon icon={cibSublimeText} height={52} className="my-4 text-white" />}
                values={[
                  {title: '지난 주', value: info.lastWeekInfo.salesMax?.name},
                  {title: '계약', value: info.lastWeekInfo.salesMax?.number}
                ]}
              />
            </CCol>
            <CCol sm={6} xl={4} xxl={3}>
              <CWidgetStatsD
                className="mb-4"
                color="danger"
                icon={<CIcon icon={cibSublimeText} height={52} className="my-4 text-white" />}
                values={[
                  {title: '지난 주', value: info.lastWeekInfo.tmMax?.name},
                  {title: '일정 등록', value: info.lastWeekInfo.tmMax?.number}
                ]}
              />
            </CCol>
            <CCol sm={6} xl={4} xxl={3}>
              <CWidgetStatsD
                className="mb-4"
                color="warning"
                icon={<CIcon icon={cibSublimeText} height={52} className="my-4 text-white" />}
                values={[
                  {title: '지난 달', value: info.lastMonthInfo.salesMax?.name},
                  {title: '계약', value: info.lastMonthInfo.salesMax?.number}
                ]}
              />
            </CCol>
            <CCol sm={6} xl={4} xxl={3}>
              <CWidgetStatsD
                className="mb-4"
                color="danger"
                icon={<CIcon icon={cibSublimeText} height={52} className="my-4 text-white" />}
                values={[
                  {title: '지난 달', value: info.lastMonthInfo.tmMax?.name},
                  {title: '일정 등록', value: info.lastMonthInfo.tmMax?.number}
                ]}
              />
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </>
  )
}

export default Dashboard
