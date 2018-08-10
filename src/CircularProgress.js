import React from 'react';
import PropTypes from 'prop-types';
import { View, ViewPropTypes } from 'react-native';
import { Svg, Path, G, Text, Circle, Defs, Use, LinearGradient, Stop } from 'react-native-svg';

export default class CircularProgress extends React.PureComponent {
  polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians)),
    };
  }

  circlePath(x, y, radius, startAngle, endAngle) {
    const start = this.polarToCartesian(x, y, radius, endAngle * 0.9999);
    const end = this.polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    const d = [
      'M', start.x, start.y,
      'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y,
    ];
    return d.join(' ');
  }

  clampFill = fill => Math.min(100, Math.max(0, fill));

  render() {
    const {
      size,
      width,
      backgroundWidth,
      tintColor,
      backgroundColor,
      style,
      rotation,
      lineCap,
      arcSweepAngle,
      fill,
      children,
    } = this.props;

    const backgroundPath = this.circlePath(size / 2, size / 2, size / 2 - width / 2, 0, arcSweepAngle);
    const circlePath = this.circlePath(size / 2, size / 2, size / 2 - width / 2, 0, arcSweepAngle * this.clampFill(fill) / 100);
    const offset = size - (width * 2);

    const childContainerStyle = {
      position: 'absolute',
      left: width,
      top: width,
      width: offset,
      height: offset,
      borderRadius: offset / 2,
      alignItems: 'center',
      justifyContent: 'center',
    };

    const circlePathArray = circlePath.split(' ');

    return (
      <View style={style}>
        <Svg
          width={size + 20}
          height={size + 20}
          style={{ backgroundColor: 'transparent' }}
        >
          <Defs>
            <LinearGradient id="greenGradient" x1="0%" y1="200%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#4A90E2" stopOpacity="1" />
              <Stop offset="70%" stopColor="#1F69C1" stopOpacity="1" />
              <Stop offset="100%" stopColor="#19208C" stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Defs>
            <G id="circlePercentage">
              <G>
                <Circle r="17" fill="#4A90E2" />
                <Text
                  stroke="white"
                  fill="white"
                  textAnchor="middle"
                  fontSize="12"
                  y={-8}
                >
                  {`${Math.round(fill)}%`}
                </Text>
              </G>
            </G>
          </Defs>
          <G rotation={rotation} originX={size / 2} originY={size / 2} x={10} y={10}>
            { backgroundColor && (
              <Path
                d={backgroundPath}
                stroke={backgroundColor}
                strokeWidth={backgroundWidth || width}
                strokeLinecap={lineCap}
                fill="transparent"
              />
            )}
            <Path
              d={circlePath}
              stroke="url(#greenGradient)"
              strokeWidth={width}
              strokeLinecap={lineCap}
              fill="transparent"
            />
            <Use rotation={-rotation} href="#circlePercentage" x={circlePathArray[1]} y={circlePathArray[2]} />
          </G>
        </Svg>
        {children && (
          <View style={childContainerStyle}>
            {children(fill)}
          </View>
        )}
      </View>
    );
  }
}

CircularProgress.propTypes = {
  style: ViewPropTypes.style,
  size: PropTypes.number.isRequired,
  fill: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  backgroundWidth: PropTypes.number,
  tintColor: PropTypes.string,
  backgroundColor: PropTypes.string,
  rotation: PropTypes.number,
  lineCap: PropTypes.string,
  arcSweepAngle: PropTypes.number,
  children: PropTypes.func,
};

CircularProgress.defaultProps = {
  style: null,
  tintColor: 'black',
  rotation: 90,
  lineCap: 'round',
  arcSweepAngle: 360,
  backgroundWidth: 0,
  backgroundColor: 'black',
  children: null,
};
