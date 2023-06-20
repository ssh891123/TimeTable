import { TableContainer, Typography, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import React from 'react';
import TimeTableRow from './TimeTableRow';
import { withStyles } from '@mui/styles';


const hourData = Array.from({length: 11}, (i, j) => j+9);
const styles = () => ({
    Table:{
        "& th,td": {
            border: "1px solid rgba(224, 224, 224, 1)"
        }
    }
})
//[9, 10, ... 19]

function TimeTable({classes}) {

    return (
        <>
        <TableContainer sx={{width:"80%", minWidth:"650px", marginLeft:"auto", marginRight:"auto", marginTop:"200px"}}>
            <Typography variant="h2" fontWeight={10} component="div" align="center">
                강의 시간표
            </Typography>
            <Table className={classes.Table}>
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

export default withStyles(styles)(TimeTable)