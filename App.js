// https://api.graphcms.com/simple/v1/swapi
import React, { Component } from 'react';
import { StatusBar, StyleSheet, Dimensions, Platform } from 'react-native';
import { BlurView, Constants } from 'expo';
import S from 'styled-components/native';

const removeForcedLineBreaks = text =>
  text
    .replace(/\r\n\r\n/g, 'ß')
    .replace(/\r\n/g, ' ')
    .replace(/ß/g, '\r\n\r\n');

const Characters = ({ characters }) => (
  <Info>
    <InfoTitle>Characters:</InfoTitle>
    <Row>
      {characters.map(({ name, id }) => (
        <Character key={id}><Text light>{name}</Text></Character>
      ))}
    </Row>
  </Info>
);

const Film = ({ episodeId, title, openingCrawl, characters }) => (
  <FilmContainer>
    <Title>Episode {episodeId}</Title>
    <Subtitle>{title}</Subtitle>
    <Content>
      <Text>{removeForcedLineBreaks(openingCrawl)}</Text>
      <Characters characters={characters} />
    </Content>
  </FilmContainer>
);

export default class App extends Component {
  state = {
    data: null,
  };

  componentDidMount() {
    this._getData();
  }

  _getData = async () => {
    const query = `
      query films {
        allFilms(orderBy: episodeId_ASC) {
          id
          episodeId
          title
          openingCrawl
          characters {
            id
            name
          }
        }
      }
    `;
    const res = await fetch('https://api.graphcms.com/simple/v1/swapi', {
      method: 'POST',
      headers: new Headers({
        'content-type': 'application/json',
      }),
      body: JSON.stringify({
        query,
        variables: null,
      }),
    });
    const data = await res.json();
    this.setState({
      data: data.data,
    });
  };
  render() {
    return (
      <Container>
        <StatusBar backgroundColor="#1c1d25" barStyle="light-content" />
        <Header>
          <BlurView
            tint="dark"
            intensity={90}
            style={StyleSheet.absoluteFill}
          />
          <Logo
            resizeMode="contain"
            source={{
              uri: 'https://www.dropbox.com/s/yv6i5ngootzz7bu/swapi.b0c6107a.png?dl=1',
            }}
          />
        </Header>
        <Divider />
        <ScrollView>
          <ScrollContainer>
            {this.state.data
              ? this.state.data.allFilms.map(film => (
                  <Film key={film.id} {...film} />
                ))
              : <Loading />}
          </ScrollContainer>
        </ScrollView>
      </Container>
    );
  }
}

const color = (l, a) => `hsla(233, 14%, ${l || 13}%, ${a || 1})`;
const HEADER = 60;
const HEADER_PADDING = 10;
const HEADER_TOTAL = HEADER + 2 * HEADER_PADDING;
const COLOR = {
  DARK: color(),
  BG: color(30),
  DIV: color(20),
  LIGHT: color(92),
  HEADER: {
    IOS: color(null, 0.55),
    ANDROID: color(null, 0.85),
  },
};
const Loading = S.ActivityIndicator`
  margin: 15;
`;
const Container = S.View`
  flex: 1;
  align-items: center;
  justify-content: flex-start;
  background-color: ${COLOR.BG};
`;
const Header = S.View`
  width: 100%;
  padding: ${HEADER_PADDING};
  padding-top: ${HEADER_PADDING + Constants.statusBarHeight};
  backgroundColor: ${() => Platform.OS === 'ios' ? COLOR.HEADER.IOS : COLOR.HEADER.ANDROID}
`;
const Logo = S.Image`
  height: 60;
`;
const Divider = S.View`
  background-color: ${COLOR.DIV};
  width: 100%;
  height: 2;
`;
const ScrollView = S.ScrollView`
 margin-top: ${-(HEADER_TOTAL + Constants.statusBarHeight)}; 
 z-index: -1;
`;
const ScrollContainer = S.View`
  margin-top:${HEADER_TOTAL + Constants.statusBarHeight + 5};
`;
const FilmContainer = S.View`
  background-color: ${COLOR.LIGHT};
  width: ${Dimensions.get('window').width - 10};
  align-items: center;
  border-radius: 10;
  padding: 10;
  margin: 5;
`;
const Text = S.Text`
  color: ${({ light }) => light ? COLOR.LIGHT : COLOR.DARK};
`;
const Title = S.Text`
  color: ${COLOR.DARK};
  font-weight: bold;
  font-size: 20;
`;
const Subtitle = S.Text`
  color: ${COLOR.DARK};
  font-style: italic;
  font-size: 18;
`;
const Content = S.View`
  width: 100%;
  flex-direction: column; 
  align-items: flex-start;
  justify-content: space-between;
`;
const Info = S.View`
  margin-top: 15;
  flex: 1;
  `;
const Character = S.View`
  background-color: ${COLOR.BG};
  padding: 4;
  margin: 3;
  border-radius: 10;
`;
const Row = S.View`
  flex: 1;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: flex-start;
`;
const InfoTitle = S.Text`
  color: ${COLOR.DARK};
  font-weight: bold;
`;
