
import { useRef } from 'react';
import { Transition } from 'react-transition-group';


const duration = 300;

export const mapNameStyle = {
    position: "fixed",
    top: "0",
    left: "50%",
    transform: "translate(-50%, 0)",
    zIndex: 1000,

    display: "flex",
    alignItems: "center",
    justifyContent: "center"

}

const defaultStyle = (textLength) => {
    return {
        transition: `all ${duration}ms cubic-bezier(0, 0, 0.2, 1) 0ms`,
        opacity: 1,
        position: "absolute",
        top: 0,
        transformOigin: "top center",
        minWidth: (textLength * 24) + 134,
        //left: -230
    }
}

const transitionStyles = (textLength) => {
    console.log(`${(textLength * 24) + 134}px`)
    return {
        entering: { height: 80, minWidth: (textLength * 24) + 134 },
        entered: { height: 80, minWidth: (textLength * 24) + 134 },
        exiting: { height: 25, width: 50, minWidth: 50 },
        exited: { height: 25, width: 50, minWidth: 50 },
    }
}

function MapSidebarTransition({ in: inProp, children, textLength }) {
    const nodeRef = useRef(null);
    return (
        <Transition nodeRef={nodeRef} in={inProp} timeout={duration} >
            {state => (
                <div ref={nodeRef} style={{
                    ...mapNameStyle,
                    ...defaultStyle(textLength),
                    ...transitionStyles(textLength)[state]
                }}>
                    {children}
                </div>
            )}
        </Transition>
    );
}

export default MapSidebarTransition;