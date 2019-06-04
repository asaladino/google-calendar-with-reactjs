import moment from "moment";
import PropTypes from "prop-types";

const EventSummary = (props) => {
    const {summary, start} = props.event;
    return `${summary} - ${moment(start.dateTime).format('dddd, MMMM Do YYYY, h:mm a')}`
};

EventSummary.propTypes = {
    event: PropTypes.shape({
        summary: PropTypes.string.isRequired,
        start: PropTypes.shape({
            dateTime: PropTypes.string.isRequired
        }).isRequired
    }).isRequired
};
export default EventSummary;