import React from 'react'
import classNames from 'classnames'

import {
  // CAvatar,
  // CButton,
  // CButtonGroup,
  // CCard,
  // CCardBody,
  // CCardFooter,
  // CCardHeader,
  // CCol,
  // CProgress,
  // CRow,
  // CTable,
  // CTableBody,
  // CTableDataCell,
  // CTableHead,
  // CTableHeaderCell,
  // CTableRow,
  CWidgetStatsA,
  // CWidgetStatsB,
  // CWidgetStatsC,
  // CWidgetStatsD,
  // CWidgetStatsE,
  // CWidgetStatsF,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
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
} from '@coreui/icons'

// import avatar1 from 'app/assets/images/avatars/1.jpg'
// import avatar2 from 'app/assets/images/avatars/2.jpg'
// import avatar3 from 'app/assets/images/avatars/3.jpg'
// import avatar4 from 'app/assets/images/avatars/4.jpg'
// import avatar5 from 'app/assets/images/avatars/5.jpg'
// import avatar6 from 'app/assets/images/avatars/6.jpg'

const Dashboard = () => {
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


  return (
    <>
        <CWidgetStatsA
          color="primary"
          value={'26'}
          title="Call 체결"
        //   action={}
        //   chart={
            // <CChartLine
            //   ref={widgetChartRef1}
            //   className="mt-3 mx-3"
            //   style={{ height: '70px' }}
            //   data={{
            //     labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            //     datasets: [
            //       {
            //         label: 'My First dataset',
            //         backgroundColor: 'transparent',
            //         borderColor: 'rgba(255,255,255,.55)',
            //         pointBackgroundColor: getStyle('--cui-primary'),
            //         data: [65, 59, 84, 84, 51, 55, 40],
            //       },
            //     ],
            //   }}
            //   options={{
            //     plugins: {
            //       legend: {
            //         display: false,
            //       },
            //     },
            //     maintainAspectRatio: false,
            //     scales: {
            //       x: {
            //         border: {
            //           display: false,
            //         },
            //         grid: {
            //           display: false,
            //           drawBorder: false,
            //         },
            //         ticks: {
            //           display: false,
            //         },
            //       },
            //       y: {
            //         min: 30,
            //         max: 89,
            //         display: false,
            //         grid: {
            //           display: false,
            //         },
            //         ticks: {
            //           display: false,
            //         },
            //       },
            //     },
            //     elements: {
            //       line: {
            //         borderWidth: 1,
            //         tension: 0.4,
            //       },
            //       point: {
            //         radius: 4,
            //         hitRadius: 10,
            //         hoverRadius: 4,
            //       },
            //     },
            //   }}
            // />
        //   }
        />
    </>
  )
}

export default Dashboard
