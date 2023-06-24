import { Button, Dialog, DialogActions, DialogContent, 
    DialogTitle, FormControl, FormControlLabel, FormLabel, 
    MenuItem, Radio, RadioGroup, Stack, TextField } from "@mui/material";
import React, { useCallback, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useRecoilState } from 'recoil';
import { timeTableState } from '../store/store';
import { v4 as uuidv1 } from 'uuid';

const timeOptions = new Array(12).fill(null).map((e, i) => ({value: i+9, label:i+9})) //e:value, i: index
//Ex: [{value:9, label:9}], [{value:10, label:10}] ...

const checkOverLap = (A, B) => B.start < A.start ? B.end > A.start : B.start < A.end;

// dataData, startTimeData, endTimeData, lectureNameData, colorData, idNum
function InputModel({showModel, handleClose, 
    dayData='mon', startTimeData=9, endTimeData=10, lectureNameData='', colorData='#00ffaa', idNum }) {
    const { formState:{errors}, control, getValues, handleSubmit, reset} = useForm();

    const [timeTableData, setTimeTableData] = useRecoilState(timeTableState);
    
    //초기값 설정 - 초기값이 없으면 콘솔창에 경고 메시지가 출력
    useEffect(() => {
        if(showModel) {
            reset({
                lectureName: lectureNameData,
                day: dayData,
                startTime: startTimeData,
                endTime: endTimeData,
                lectureColor: colorData,
            })
        }
    }, [showModel, reset, dayData, startTimeData, endTimeData, lectureNameData, colorData, idNum]);

    const Submit = useCallback(({lectureName, day, startTime, endTime, lectureColor}) =>{
        // 중복 검사
        let valid = true;
        for(let index=0 ; index<timeTableData[day].length ; index++) {
            if(checkOverLap(timeTableData[day][index], {start:startTime, end:endTime})) {
                valid = false;
                break;
            }
        }

        if(!valid) {
            alert("해당 시간에 강의가 이미 존재합니다.");
            return;
        }

        // 강의 시간표 추가
        const data = {
            start: startTime,
            end:endTime,
            name:lectureName,
            color:lectureColor,
            id:uuidv1(),
        };
        setTimeTableData((oldTimeData) => ({
            ...oldTimeData,
            [day]: [...oldTimeData[day], data]
        }));

        handleClose();
    }, [timeTableData, setTimeTableData, handleClose]);

    const Edit = useCallback(({lectureName, day, startTime, endTime, lectureColor}) => {
        // 중복 검사
        let valid = true;
        for(let index=0 ; index < timeTableData[day].length ; index++) {
            if(checkOverLap(timeTableData[day][index], {start:startTime, end:endTime}) &&
                timeTableData[day][index]["id"] !== idNum) {
                valid = false;
                break;
            }
        }

        if(!valid) {
            alert("해당 시간에 강의가 이미 존재합니다.");
            return;
        }

        const filteredDayData = [...timeTableData[dayData].filter(data => data.id !== idNum)];

        const newTimeTableData = {
            ...timeTableData,
            [dayData]: filteredDayData
        };

        const newDayData = [...newTimeTableData[day], {
            start: startTime,
            end: endTime,
            id: idNum,
            name: lectureName,
            color: lectureColor
        }];

        setTimeTableData({
            ...newTimeTableData,
            [day]:newDayData
        });
        
        handleClose();
    }, [dayData, handleClose, idNum, setTimeTableData, timeTableData]);

    return (
        <Dialog open={showModel} onClose={handleClose}>
            <form onSubmit={handleSubmit(idNum ? Edit : Submit)}> 
            <DialogTitle>강의정보 입력</DialogTitle>
            <DialogContent style={{width:"400px"}}>
                <Controller //react-hook-form
                    control={control}
                    name="lectureName"
                    rules={{ required:true }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            error={!!errors.lectureName}
                            style={{marginTop:"30px", width:"350px"}}
                            autoComplete="off" //자동완성 기능
                            label="강의명"
                        />
                    )}
                />
                {errors.lectureName?.type === 'required' && (
                    <p style={{color:"#d32f2f"}}>강의명을 입력해주세요.</p>
                )}
                <FormControl style={{marginTop:"30px"}}>
                    <FormLabel>요일</FormLabel>
                    <Controller
                        control={control}
                        name="day"
                        rules={{required:true}}
                        render={({field}) =>(
                            <RadioGroup {...field} style={{display:"block"}}>
                                <FormControlLabel
                                value="mon"
                                control={<Radio />}
                                label="Mon"
                                />
                                <FormControlLabel
                                value="tue"
                                control={<Radio />}
                                label="Tue"
                                />
                                <FormControlLabel
                                value="wed"
                                control={<Radio />}
                                label="Wed"
                                />
                                <FormControlLabel
                                value="thu"
                                control={<Radio />}
                                label="Thu"
                                />
                                <FormControlLabel
                                value="fri"
                                control={<Radio />}
                                label="Fri"
                                />
                            </RadioGroup>
                        )}
                    />
                </FormControl>
                <Stack spacing={3} style={{marginTop:"30px", width:"350px"}}>
                    <Controller
                        control={control}
                        name="startTime"
                        rules={{ required:true }}
                        render={({ field }) => (
                            // error| required가 아닌 경우 error로 인지하기 위함
                            <TextField
                                {...field} 
                                select 
                                error={!!errors.startTime || !!(errors.endTime?.type === 'validate')}
                                style={{marginTop:'30px', width:"350px"}}
                                label="시작 시간"
                                placeholder="시작 시간 선택"
                                >
                                {timeOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}
                    />
                    {errors.startTime?.type === "required" && (
                        <p style={{color:"#d32f2f"}}>강의 시작 시간 선택</p>
                    )}

                    <Controller
                        control={control}
                        name="endTime"
                        rules={{required:true,  validate:(value) => getValues('startTime') < value}}
                        render={({field}) => (
                            // error| required가 아닌 경우 error로 인지하기 위함
                            <TextField 
                                {...field} 
                                select 
                                error={!!errors.endTime}
                                style={{marginTop:'30px', width:"350px"}}
                                label="종료 시간"
                                placeholder="종료 시간 선택"
                                >
                                    {timeOptions.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                            </TextField>
                        )}
                    />
                    {errors.endTime?.type === "required" && (
                        <p style={{color:"#d32f2f"}}>강의 종료 시간 선택</p>
                    )}
                    {errors.endTime?.type === "validate" && (
                        <p style={{color:"#d32f2f"}}>시작시간과 종료시간을 확인해주세요.</p>
                    )}
                </Stack>
                <div style={{marginTop:"30px"}}>
                    <label htmlFor="lectureColor">시간표 색상:</label>
                    <Controller
                        control={control}
                        name="lectureColor"
                        render={({field}) => (
                            <input
                            {...field}  
                            style={{marginLeft:"30px"}}
                            id="lectureColor"
                            type="color"
                            />
                        )}
                    />
                </div>
            </DialogContent>
            <DialogActions>
                    <Button onClick={handleClose}>취소</Button>
                    <Button type="submit">입력</Button>
            </DialogActions>
            </form>
        </Dialog>
    )
}

export default InputModel