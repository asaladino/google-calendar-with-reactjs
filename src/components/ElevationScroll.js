import useScrollTrigger from "@material-ui/core/useScrollTrigger/useScrollTrigger";
import React from "react";
import PropTypes from "prop-types";

const ElevationScroll = (props) => {
    const {children, window} = props;
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0,
        target: window ? window() : undefined,
    });

    return React.cloneElement(children, {
        elevation: trigger ? 4 : 0,
    });
};

ElevationScroll.propTypes = {
    children: PropTypes.node.isRequired,
    window: PropTypes.func,
};

export default ElevationScroll;