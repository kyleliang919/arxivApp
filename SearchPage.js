'use strict';

import React, { Component } from 'react';
import SearchResults from './SearchResults';
import History from './History';
import Expo, { Constants } from 'expo';

import {
	StyleSheet,
	Text,
	TextInput,
	View,
	Button,
	ActivityIndicator,
	Image,
	FlatList,
	Linking,
	TouchableOpacity
} from 'react-native';

import * as firebase from 'firebase';
// Initialize Firebase
const firebaseConfig = {
	apiKey: "AIzaSyA5lwfazABw4B5Pn8Wbh03_4Xnu54N50tM",
	authDomain: "arxivapp.firebaseapp.com",
	databaseURL: "https://arxivapp.firebaseio.com",
	projectId: "arxivapp",
	storageBucket: "arxivapp.appspot.com",
	messagingSenderId: "276772613616"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const database = firebaseApp.database();

const parseString = require('react-native-xml2js').parseString;

const fb_id = "344497916345311";

function urlForQueryAndPage(key, value, pageNumber) {
  const data = {
      start:1,
      max_results:20,
  };
  data[key] = value;

  const querystring = Object.keys(data)
    .map(key => key + '=' + encodeURIComponent(data[key]))
    .join('&');

  return 'http://export.arxiv.org/api/query?' + querystring;
}


var self;

export default class SearchPage extends Component<{}> {
	constructor(props) {
		super(props);
		this.state = {
			searchString: '',
			isLoading: false,
			message:'',
			log_url:'https://cis.cornell.edu/sites/default/files/styles/square_thumbnail/public/Screen%20Shot%202018-09-04%20at%2010.17.51%20AM.png?itok=dxbUcd1u',
			rss: undefined,
			prev_rss_domain:undefined,
			rss_domain:'cs.AI',
			fbProfile: {"picture":{"data":{"url":"https://pbs.twimg.com/profile_images/824716853989744640/8Fcd0bji_400x400.jpg"}}}
		};
		self = this;
	}

	callGraph = async token => {
    	const response = await fetch(
      		`https://graph.facebook.com/me?access_token=${token}&fields=id,name,email,about,picture`
    	);
    	const responseJSON = await response.json();
    	this.setState({ fbProfile: responseJSON });
  	};

	login = async () => {
	    const {
	      type,
	      token,
	    } = await Expo.Facebook.logInWithReadPermissionsAsync(fb_id, {
	      permissions: ['public_profile', 'email', 'user_friends'],
	    });

	    if (type === 'success') {
	      this.callGraph(token);
	      this.setState({fb_token:token});
	    }
  	};

  	listenForItems = async (itemsRef) => {
		var counter = {"cs.AI":0};
	    itemsRef.on('value', async (snap) => {
	      await snap.forEach((child) => {
	      	const cat = child.val().category;
	        if(counter[cat]==undefined){counter[cat]=1;}
	        else{
	        	counter[cat]= counter[cat]+1;
	        }
	      });
	      console.log(counter);
	      this.setState({rss_domain:Object.keys(counter).reduce((a, b)=>{ return counter[a] > counter[b] ? a : b })});
	      console.log(this.state.rss_domain);
	    }
	    );
	}

	FetchDataFromRssFeed() {
		var request = new XMLHttpRequest();
		request.onreadystatechange = () => {
		  if (request.readyState == 4 && request.status == 200) {
		  	var arr = [];
		    parseString(request.responseText, function(err,result){
		    	for (var key in result["rdf:RDF"]["item"]) {
				    if (result["rdf:RDF"]["item"].hasOwnProperty(key)) {  
				    	arr.push(result["rdf:RDF"]["item"][key]);         
				    }
				}
		    });
		    this.setState({rss:arr});
		  }
		}
		console.log("rss domain:"+this.state.rss_domain);
		request.open("GET", 'http://arxiv.org/rss/'+this.state.rss_domain , true);
		request.send();
	}

	componentDidMount() {
		this.listenForItems(database.ref());
  	}

	_executeQuery = (query) => {
		this.setState({ isLoading: true });
		fetch(query)
			.then(response => response.text())
  			.then((response) => {
  				parseString(response, function (err, result) {
  					self._handleResponse(result["feed"]["entry"]);
            });
        	})
  			.catch(error =>
     			this.setState({
      				isLoading: false,
      				message: 'Something bad happened ' + error
   		}));

	};

	_onSearchPressed = () => {
		const query = urlForQueryAndPage('search_query', this.state.searchString, 1);
		this._executeQuery(query);
	};
	_onHistoryPressed = () =>{
		this.props.navigator.push({
			title:'History',
			component: History,
			passProps: {database: database}
		});
	}

	_handleResponse = (response) => {
		this.setState({ isLoading: false , message: ''});
		var props = {
			data:response,
			navigator:this.props.navigator,
			database: database,
			fb_token: this.state.fb_token,
		}
		if (response.length > 0) {
			this.props.navigator.push({
				title: 'Results',
				component: SearchResults,
				passProps: {listings: props}
			});
		} else {
			this.setState({ message: 'No results found'});
		}
	};

	render() {
		const spinner = this.state.isLoading ? <ActivityIndicator size='large'/> : null;
		if(this.state.prev_rss_domain!==this.state.rss_domain){
			console.log("updating RSS feed");
			this.FetchDataFromRssFeed();
			this.state.prev_rss_domain = this.state.rss_domain;
		}
		return (
			<View style={styles.container}>
				<Image source={{uri: this.state.fbProfile["picture"]["data"]["url"]}} style={styles.profile}/>
				<Image source={{uri: this.state.log_url}} style={styles.image}/>
				<TouchableOpacity onPress={() => this.login()}>
				      <View
				        style={{
				          width: '50%',
				          alignSelf: 'center',
				          borderRadius: 4,
				          padding: 10,
				          backgroundColor: '#3B5998',
				        }}>
				        <Text style={{ color: 'white', fontWeight: 'bold' }}>
				          Login to Facebook
				        </Text>
				      </View>
    			</TouchableOpacity>
				<TouchableOpacity onPress={this._onHistoryPressed}>
				      <View
				        style={{
				          width: '50%',
				          alignSelf: 'center',
				          borderRadius: 4,
				          padding: 10,
				          backgroundColor: '#870000',
				          marginTop: 10
				        }}>
				        <Text style={{ color: 'white', fontWeight: 'bold' }}>
				          history
				        </Text>
				      </View>
    			</TouchableOpacity>
				<View style={styles.flowRight}>
					<TextInput
						style={styles.searchInput}
						value={this.state.searchString}
						onChange={this._onSearchTextChanged}
						placeholder='Search via name or author'/>
					<Button
						onPress={this._onSearchPressed}
						color='#48BBEC'
						title='Go'/>
				</View>
				{spinner}
				<Text style={styles.description}>{this.state.message}</Text>
				<View>
					<FlatList
          				data={this.state.rss}
          			ListHeaderComponent={()=> <Text style={styles.listHeader}>Latest Update</Text>}
          			renderItem={({item}) => <Text style={styles.rssFeed} onPress={()=>{Linking.openURL(item["link"][0])}}>{item["title"][0]}</Text>}/>
        		</View>
        		<Text>this.state.name</Text>
        		<Text>this.state.url</Text>
			</View>
	    );
	}
	_onSearchTextChanged = (event) => {
		this.setState({ searchString: event.nativeEvent.text });
	};
}

const styles = StyleSheet.create({
	description: {
		marginBottom: 20,
		fontSize: 18,
		textAlign: 'center',
		color: '#656565'
	},
	container: {
		padding: 30,
		marginTop: 120,
		alignItems: 'center'
	},
	flowRight: {
		flexDirection: 'row',
		alignItems: 'center',
		alignSelf: 'stretch',
	},
	searchInput: {
		height: 36,
		padding: 4,
		marginRight: 5,
		marginTop: 20,
		flexGrow: 1,
		fontSize: 18,
		borderWidth: 1,
		borderColor: '#48BBEC',
		borderRadius: 8,
		color: '#48BBEC',
	},
	profile:{
		width:50,
		height:50,
		margin:10,
		marginTop: - 90,
		marginLeft: - 15,
		alignSelf: 'stretch',
		borderRadius: 10,
	},
	image: {
		width: 150,
		height: 150,
		margin: 20,
	},
	listHeader:{
		fontSize:18,
		color: '#656565',
		textAlign: 'center',
		marginBottom:10
	},
	rssFeed:{
		fontSize:12,
		marginBottom:10,
		color: '#870000',
	}
});