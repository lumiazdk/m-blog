import React from 'react';
import SwipeableViews from 'react-swipeable-views';
import Animated from 'animated/lib/targets/react-dom';
const styles = {
  root: {
    background: '##fff',
    padding: '10px 10px',
  },
  slide: {
    color: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    display: 'flex',
  },
  img: {
    width: '90%',
    height: 144,
    display: 'block',
    marginBottom: 16,
  },
};

const albums = [
  {
    name: 'Abbey Road',
    src: '/img/bj.jpg',
  },
  {
    name: 'Bat Out of Hell',
    src: '/img/bj.jpg',
  },
  {
    name: 'Homogenic',
    src: '/img/bj.jpg',
  },
  {
    name: 'Number of the Beast',
    src: '/img/bj.jpg',
  },
  {
    name: "It's Blitz",
    src: '/img/bj.jpg',
  },
  {
    name: 'The Man-Machine',
    src: '/img/bj.jpg',
  },
  {
    name: 'The Score',
    src: '/img/bj.jpg',
  },
  {
    name: 'Lost Horizons',
    src: '/img/bj.jpg',
  },
];

class Find extends React.Component {
  state = {
    index: 0,
    position: new Animated.Value(0),
  };

  handleChangeIndex = index => {
    this.setState({ index });
  };

  handleSwitch = (index, type) => {
    if (type === 'end') {
      Animated.spring(this.state.position, { toValue: index }).start();
      return;
    }
    this.state.position.setValue(index);
  };

  render() {
    const { index, position } = this.state;

    return (
      <SwipeableViews
        index={index}
        style={styles.root}
        onChangeIndex={this.handleChangeIndex}
        onSwitching={this.handleSwitch}
      >
        {albums.map((album, currentIndex) => {
          const inputRange = albums.map((_, i) => i);
          const scale = position.interpolate({
            inputRange,
            outputRange: inputRange.map(i => {
              return currentIndex === i ? 1 : 0.7;
            }),
          });
          const opacity = position.interpolate({
            inputRange,
            outputRange: inputRange.map(i => {
              return currentIndex === i ? 1 : 0.3;
            }),
          });
          const translateX = position.interpolate({
            inputRange,
            outputRange: inputRange.map(i => {
              return (100 / 2) * (i - currentIndex);
            }),
          });

          return (
            <Animated.div
              key={String(currentIndex)}
              style={Object.assign(
                {
                  opacity,
                  transform: [{ scale }, { translateX }],
                },
                styles.slide,
              )}
            >
              <img style={styles.img} src={album.src} alt="cover" />
            </Animated.div>
          );
        })}
      </SwipeableViews>
    );
  }
}

export default Find;