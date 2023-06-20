import React, { useMemo } from 'react';
import { TableCell } from '@mui/material';
import { useRecoilState } from 'recoil';
import { timeTableState } from '../store/store';

function TimeTableCell({day, timeNum}) {
    const [timeTableData, setTimeTableData] = useRecoilState(timeTableState);
    // 요일, 현재시간 -> timeTableData 현재, 시간에 해당하는 data
    // 시작 <= 현재시간 <= 끝
    const timeData = useMemo(() => 
        timeTableData[day].find(
        (time) => time.start <= timeNum && timeNum <= time.end)
    , [day, timeNum, timeTableData]);
    // console.log(timeData);
    return (
        <>
        {
            timeData?.start === timeNum ? 
            <TableCell 
                style={{backgroundColor:timeData.color, position:"relative"}} 
                align="center" 
                rowSpan={timeData.end - timeData.start}>
                {timeData.name}
            </TableCell>
            : timeData?.start < timeNum && timeNum < timeData?.end ?
                null 
                : <TableCell/>
        }
        </>
    )
}

export default TimeTableCell;