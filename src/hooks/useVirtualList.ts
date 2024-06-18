import React, { useRef } from "react";

function useVirtualList() {
    const ref = useRef(null);
    const [state, setState] = React.useState({
        start: 0,
        end: 0,
    });
    return {
        state,
        ref,
        setState
    }
}
export default useVirtualList;