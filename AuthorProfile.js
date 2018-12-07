'use strict';

import React, { Component } from 'react'
import {
  StyleSheet,
  Image,
  View,
  Linking,
  TouchableHighlight,
  FlatList,
  Text,
  TouchableOpacity,
} from 'react-native';

export default class AuthorProfile extends Component<{}> {
	constructor(props) {
	  super(props);
	  this.state = {
	  	authorProfile:{
	  		query:{
	  			pages:{
	  				dummy:{
	  					extract:"Author not found on Wiki!!"
	  				}
	  			}
	  		}
	  	}
	  };
	}
	getAuthorProfile = async token => {
    	const response = await fetch(
      		"https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles="+this.props.name.split(" ").join("%20")
    	);
    	const responseJSON = await response.json();
    	this.setState({authorProfile:responseJSON});
  	};
	componentDidMount() {
    	this.getAuthorProfile();
  	}
	render() {
		if(this.state.authorProfile===undefined){return null;}
		var keys = Object.keys(this.state.authorProfile["query"]["pages"]);
		const summary = keys.map((k)=>{return (<Text>{this.state.authorProfile["query"]["pages"][k]["extract"]}</Text>)});
		return (
			<View style={styles.container}>
				<Image source={{uri: "https://pbs.twimg.com/profile_images/824716853989744640/8Fcd0bji_400x400.jpg"}} style={styles.image}/>
				<View>
					{summary}
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		padding: 20,
		marginTop: 60,
		alignItems: 'center'
	},
	image: {
		width: 150,
		height: 150,
		margin: 20,
	},

	title:{
		marginBottom: 10,
		fontSize: 20,
		color: '#000000'
	},

	author:{
		marginBottom: 5,
		fontSize: 12,
		fontWeight: 'bold',
		color: '#48BBEC',
		marginLeft: 5
	},

	summary:{
		color:'#656565',
		fontSize: 18
	},

	publish_date:{
		color:'#48BBEC',
		fontSize: 10
	},

	update_date:{
		color:'#48BBEC',
		fontSize: 10,
		marginBottom: 10,
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
		flexGrow: 1,
		fontSize: 18,
		borderWidth: 1,
		borderColor: '#48BBEC',
		borderRadius: 8,
		color: '#48BBEC',
	},
	image: {
		width: 150,
		height: 150,
		margin: 20,
	},
});


