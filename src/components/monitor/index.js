import { Box } from "@mui/material";
import { useState } from "react";
import LandmarkSidebar from "./landmarkSidebar";
import MapSidebar from "./mapSidebar";


const Monitor = (props) => {
    const { landmarks, children, selectLandmark, landmarkStatus } = props;
    const [open, setOpen] = useState(true);
    const [openMapSidebar, setOpenMapSidebar] = useState(true);


    return (<Box sx={{ position: "relative", p: 0, display: "flex", height: "100%" }}>
        <LandmarkSidebar
            onClose={() => setOpen(false)}
            setOpen={() => setOpen(!open)}
            open={open}
            selectLandmark={selectLandmark}
            landmarks={landmarks} />
        <Box sx={{
            width: {
                xs: "100%",
                lg: `calc(100% - ${open ? 260 : 0}px)`
            },
            transition: "all 225ms cubic-bezier(0, 0, 0.2, 1) 0ms",
            height: "100%",
            position: {
                xs: "absolute",
                lg: "relative"
            },
            right: {
                xs: 0,
                lg: open ? -260 : 0
            },
            //left: open ? 0 : 230,
            zIndex: 999

        }}>
            {children}

            <Box sx={{
                width: "100%",
                height: {
                    // xs: "100%",
                    xs: openMapSidebar ? 100 : 20
                },
                // paddingLeft: {
                //     xs: 0,
                //     lg: open ? "230px" : 0
                // },
                transition: "all 225ms cubic-bezier(0, 0, 0.2, 1) 0ms",
                position: "absolute",

                bottom: 0,
                //left: open ? 0 : 230,
                overflow: "hidden",
                zIndex: 999

            }}>
                <MapSidebar
                    open={openMapSidebar}
                    setOpen={() => setOpenMapSidebar(!openMapSidebar)}
                    landmarkStatus={landmarkStatus}
                />
            </Box>
        </Box>

    </Box>)
}

export default Monitor;