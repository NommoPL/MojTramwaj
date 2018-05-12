import React from 'react';
import { StyleSheet } from 'react-native';
import {
  Container,
  Header,
  Content,
  Item,
  Input,
  Icon,
  Button,
  Text,
  List,
  ListItem
} from 'native-base';

import {
  AllHtmlEntities
} from 'html-entities';

const entities = new AllHtmlEntities();

export default class LinksScreen extends React.Component {

  static navigationOptions = {
    title: 'Na Przystanku',
  };

  constructor(props){
    super(props);

    this.state = {
      stopNameQuery: '',
      stops: []
    }
  }

  queryUpdate = (query) => {
    this.setState({
      stopNameQuery: query
    });
    this.downloadStopsWithQuery(query).then((stops) => {
      for(let i=0;i<stops.length;i++){
        stops[i].name = entities.decode(stops[i].name);
        console.log(stops[i].name);
      }
      this.setState({
        stops: stops
      });
    }).catch((err) => {
      console.error(err);
    })
  }

  downloadStopsWithQuery = (q) => {
    if(q.length === 0){
      return new Promise(() => []);
    }
    const apiLink = `http://www.ttss.krakow.pl/internetservice/services/lookup/autocomplete/json?query=${q}`;

    return fetch(apiLink)
           .then((response) => response.json())
           .then((json) => json.filter((e) =>{
             return e.id;
           }))
           .catch((err) => {
             console.error(err);
           });
  }

  render() {
    return (
      <Container>
        <Header searchBar rounded>
          <Item>
            <Icon name="ios-search" />
            < Input type = "text"
            placeholder = "Nazwa przystanku..."
            value = {
              this.state.stopNameQuery
            }
            onChangeText = {
              (query) => this.queryUpdate(query)
            }
            />
            <Icon name="ios-train" />
          </Item>
        </Header>
        <Content>
          <List dataArray={this.state.stops}
            renderRow={(item) =>
              <ListItem>
                <Text>{item.name}</Text>
              </ListItem>
            }>
          </List>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
