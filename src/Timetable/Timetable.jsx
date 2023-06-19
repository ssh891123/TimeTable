import { TableContainer, Typography, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import React from 'react';
import TimeTableRow from './TimeTableRow';


const hourData = Array.from({length: 11}, (i, j) => j+9);
//[9, 10, ... 19]

function TimeTable() {

    return (
        <>
        <TableContainer>
            <Typography>
                강의 시간표
            </Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell align="center" width={100}>Time</TableCell>
                        <TableCell align="center" width={200}>Mon</TableCell>
                        <TableCell align="center" width={200}>Tue</TableCell>
                        <TableCell align="center" width={200}>Wed</TableCell>
                        <TableCell align="center" width={200}>Thu</TableCell>
                        <TableCell align="center" width={200}>Fri</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {hourData.map((time, index) => (
                        <TableRow key={index}>
                            <TableCell align="center">{`${time}:00 - ${time+1}:00`}</TableCell>
                            <TimeTableRow timeNum={time}/>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        </>
    )
}

export default TimeTable