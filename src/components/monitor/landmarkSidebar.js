import { Box, Button, IconButton, InputAdornment, List, ListItem, ListItemButton, ListItemText, Paper, Slide, SvgIcon, TextField } from "@mui/material";
import SwitchVideoIcon from '@mui/icons-material/SwitchVideo';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useState, useRef, useEffect } from "react";
import { Search as SearchIcon } from '../../icons/search';
import Mark from "mark.js";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Transition } from 'react-transition-group';


const duration = 300;

const defaultStyle = {
    transition: `all ${duration}ms cubic-bezier(0, 0, 0.2, 1) 0ms`,
    opacity: 1,
    position: "absolute",
    height: "100%",
    //left: -230
}

const transitionStyles = {
    entering: { transform: "none" },
    entered: { transform: "none" },
    exiting: { transform: "translateX(-280px)" },
    exited: { transform: "translateX(-280px)" },

    // entering: { left: -230 },
    // entered: { left: -230 },
    // exiting: { left: 0 },
    // exited: { left: 0 },
};

function SidebarTransition({ in: inProp, children }) {
    const nodeRef = useRef(null);


    return (
        <Transition nodeRef={nodeRef} in={inProp} timeout={duration} >
            {state => (
                <div ref={nodeRef} style={{
                    ...defaultStyle,
                    ...transitionStyles[state]
                }}>
                    {children}
                </div>
            )}
        </Transition>
    );
}

const LandmarkSidebar = (props) => {
    const { open, setOpen, onClose, selectLandmark, landmarks } = props;
    const [filterIndex, setFilterIndex] = useState([]);
    const [nowIndex, setNowIndex] = useState(0);
    const menuBtnSx = (close) => {
        return {
            minWidth: 20,
            padding: "10px 0",
            height: 50,
            position: "absolute",
            left: close ? 0 : "auto",
            right: close ? "auto" : -24,
            top: 0,
            borderRadius: "0 0 6px",
            transition: "all 300ms cubic-bezier(0, 0, 0.2, 1) 0ms"
        }
    }
    const [select, setSelect] = useState(0);

    useEffect(() => {
        if (landmarks.length > 0) {
            setFilterIndex([...Array(landmarks.length).keys()])
        }
    }, [landmarks && landmarks.length])

    const handleOpen = () => {
        setOpen();
    }

    const handelSelectLandmark = (landmark, index) => {

        selectLandmark(landmark)
        setSelect(index)
    }
    const handleChange = (event) => {
        const searchValue = event.target.value;
        const markInstance = new Mark(document.querySelector("#landmark-list"));
        if (landmarks.length == 0) {
            return;
        }
        setNowIndex(0)
        setSelect(0)
        if (!searchValue) {
            markInstance.unmark();
            setFilterIndex([...Array(landmarks.length).keys()])
            selectLandmark(landmarks[0])
            return;
        }
        markInstance.unmark({
            done: () => {
                const data = markInstance.mark(searchValue);
                const selectsIndex = [...document.querySelectorAll("mark")].map(item => {
                    try {
                        return item.parentElement.parentElement.parentElement.tabIndex
                    } catch (e) {
                        return -1
                    }
                })
                console.log([...new Set(selectsIndex)])
                const setIndex = [...new Set(selectsIndex)];
                setFilterIndex(setIndex)
                setSelect(setIndex[0])
                selectLandmark(landmarks[setIndex[0]])
            }
        });

    }

    const handleNext = (index) => {
        const next = nowIndex + index;
        let getIndex = 0;
        if (filterIndex.length > 0 && next <= -1) {
            getIndex = filterIndex.length - 1;
        }
        if (filterIndex.length > 0 && next > 0 && next <= filterIndex.length - 1) {
            getIndex = next;
        }
        setNowIndex(getIndex)
        setSelect(filterIndex[getIndex])
        selectLandmark(landmarks[getIndex])
    }

    const content = (<Paper

        sx={{
            borderRadius: 0,
            height: "100%",
            display: 'flex',
            position: "relative"
        }}
        elevation={4}>
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                width: 280
            }}
        >
            <Box sx={{ m: 2 }}>
                <TextField
                    fullWidth
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SvgIcon
                                    color="action"
                                    fontSize="small"
                                >
                                    <SearchIcon />
                                </SvgIcon>
                            </InputAdornment>
                        ),
                        endAdornment: (<>
                            <IconButton onClick={() => handleNext(-1)}>
                                <KeyboardArrowUpIcon />
                            </IconButton>
                            <IconButton onClick={() => handleNext(1)}>
                                <KeyboardArrowDownIcon />
                            </IconButton>
                        </>)
                    }}
                    onChange={handleChange}
                    placeholder="查詢攝影機"
                    variant="outlined"

                />
            </Box>
            <List id={"landmark-list"} >
                {landmarks.map((item, index) => {

                    return <ListItemButton
                        key={`landmark-key-${index}`}
                        selected={index === select}
                        tabIndex={index}
                        onClick={() => handelSelectLandmark(item, index)}
                    // secondaryAction={
                    //     <IconButton edge="end" aria-label="switch">
                    //         <SwitchVideoIcon />
                    //     </IconButton>
                    // }
                    >

                        <ListItemText
                            primary={item.name ? item.name : ""}
                            secondary={null}
                        />
                    </ListItemButton>
                })}

            </List>


        </Box>
        <Button color="primary" variant="contained"
            sx={menuBtnSx(false)} onClick={handleOpen}>
            <ChevronRightIcon />
        </Button>
    </Paper>)

    return (<Box sx={{
        zIndex: 1000,
        display: "flex"
    }}><SidebarTransition

        in={open}


    >
            {content}
        </SidebarTransition>
        {/* {<Button sx={menuBtnSx(true)} color="primary" variant="contained"
            onClick={handleOpen}>
            <ChevronRightIcon />
        </Button>} */}
    </Box>
    )
}

export default LandmarkSidebar;