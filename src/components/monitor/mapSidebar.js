import { Box, Button, Paper, Typography, } from "@mui/material";
import { styled } from '@mui/material/styles';
import { Transition } from 'react-transition-group';
import { grey } from '@mui/material/colors';
import { Stack } from "@mui/system";
import { useRef } from "react";



const duration = 300;

const defaultStyle = {
    transition: `all ${duration}ms cubic-bezier(0, 0, 0.2, 1) 0ms`,
    opacity: 1,
    position: "absolute",
    bottom: 0,
    width: "100%",
}

const transitionStyles = {
    entering: { transform: "none" },
    entered: { transform: "none" },
    exiting: { transform: "translateY(80px)" },
    exited: { transform: "translateY(80px)" },
};

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#1e252f',
    ...theme.typography.body2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    maxWidth: "33%",
    width: "280px",
    display: "flex",
    border: "solid 1px white",
    borderRadius: "8px",
    flexDirection: "column",
    [theme.breakpoints.up('md')]: {
        flexDirection: "row"
    }

}));

const ItemTitle = styled(Box)(({ theme, bgcolor, textcolor, direction }) => ({
    backgroundColor: bgcolor,
    ...theme.typography.body2,
    display: "table-cell",
    padding: theme.spacing(1),
    textAlign: 'center',
    width: "100%",
    color: textcolor,
    borderRadius: direction === "right" ? "8px 8px 0 0" : "0 0 8px 8px",
    [theme.breakpoints.up('md')]: {
        width: "50%",
        borderRadius: direction === "right" ? "8px 0 0 8px" : "0 8px 8px 0",
    }


}));

function MapSidebarTransition({ in: inProp, children }) {
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

const Puller = styled(Box)(({ theme }) => ({
    width: 30,
    height: 6,
    backgroundColor: theme.palette.mode === 'light' ? grey[300] : grey[900],
    borderRadius: 3,
    position: 'absolute',
    top: 8,
    left: 'calc(50% - 15px)',
    cursor: "pointer"
}));


const MapSidebar = (props) => {
    const { open, setOpen, landmarkStatus } = props;

    const handleOpen = () => {
        setOpen();
    }

    const content = (<Paper

        sx={{
            borderRadius: 0,
            width: "100%",
            display: 'flex',
            flexDirection: 'column'
        }}
        elevation={4}>
        <Puller onClick={handleOpen} />
        {/* <Button color="primary"
            sx={menuBtnSx(false)} onClick={handleOpen}>
            <ChevronRightIcon />
        </Button> */}

        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                height: 100,
                background: "#1e252f"
            }}
        >
            <Stack sx={{ m: "auto", width: "100%", justifyContent: "center" }} direction="row" spacing={4}>
                <Item>
                    <ItemTitle bgcolor={"#bfe5be"} textcolor={"black"} direction={"right"} >
                        設備監測率 {`${landmarkStatus.livePercent}%`}
                    </ItemTitle>
                    <ItemTitle bgcolor={""} textcolor={"white"} >
                        {landmarkStatus.live}
                    </ItemTitle>
                </Item>
                <Item>
                    <ItemTitle bgcolor={"#e6cbfe"} textcolor={"black"} direction={"right"} >
                        維護數 {`${landmarkStatus.maintainPercent}%`}
                    </ItemTitle>
                    <ItemTitle bgcolor={""} textcolor={"white"} >
                        {landmarkStatus.maintain}
                    </ItemTitle>
                </Item>
                <Item>
                    <ItemTitle bgcolor={"#e0e0e0"} textcolor={"black"} direction={"right"} >
                        離線數 {`${landmarkStatus.offPercent}%`}
                    </ItemTitle>
                    <ItemTitle bgcolor={""} textcolor={"white"} >
                        {landmarkStatus.off}
                    </ItemTitle>
                </Item>
            </Stack>
        </Box>

    </Paper >)

    return (<Box sx={{
        zIndex: 1000,
        display: "flex"
    }}><MapSidebarTransition

        in={open}
    >
            {content}
        </MapSidebarTransition>
    </Box>
    )
}

export default MapSidebar;