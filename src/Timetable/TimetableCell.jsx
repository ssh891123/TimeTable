import React, { useCallback, useMemo, useState } from 'react';
import { TableCell } from '@mui/material';
import { useRecoilState } from 'recoil';
import { timeTableState } from '../store/store';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function TimeTableCell({day, timeNum, Edit}) {
    const [timeTableData, setTimeTableData] = useRecoilState(timeTableState);
    const [hover, setHover] = useState(false);
    // 요일, 현재시간 -> timeTableData 현재, 시간에 해당하는 data
    // 시작 <= 현재시간 <= 끝
    const timeData = useMemo(
        () => 
            timeTableData[day]?.find(
                (time) => time.start <= timeNum && timeNum <= time.end)
    , [day, timeNum, timeTableData]);

    const handleEdit = useCallback(() => Edit(day, timeData.id), [Edit, day, timeData?.id]);
    return (
        <>
        {
            timeData?.start === timeNum ? 
            <TableCell 
                style={{backgroundColor:timeData.color, position:"relative"}} 
                align="center" 
                rowSpan={timeData.end - timeData.start}
                onMouseOver={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
            >
                {timeData.name}
                {hover ? (
                    <div style ={{position:"absolute", top:5, right:5}}>
                        <EditIcon style ={{cursor:"pointer"}} onClick={handleEdit}/>
                        <DeleteIcon style ={{cursor:"pointer"}} onClick={() => {}}/>
                    </div>

                ) : null}
            </TableCell>
            : timeData?.start < timeNum && timeNum < timeData?.end ?
                null 
                : <TableCell/>
        }
        </>
    )
}

export default TimeTableCell;