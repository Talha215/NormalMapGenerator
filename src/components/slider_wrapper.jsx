import React from 'react';
import PropTypes from 'prop-types';

const SliderWrapper = props => {
    return (
    <div>
        {props.name_value}
            <input className="slider-wrapper" type="range" min={props.min_value} max={props.max_value} step={props.step_value} 
                    defaultValue={props.default_value} onChange={props.funcforthis}/>
    </div>
    );
};

SliderWrapper.propTypes = {
    children: PropTypes.node,
    name_value: PropTypes.string,
    min_value: PropTypes.number,
    max_value: PropTypes.number,
    step_value: PropTypes.number,
    default_value: PropTypes.number,
    funcForThis: PropTypes.func,
};

export default SliderWrapper