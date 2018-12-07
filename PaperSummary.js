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
  Share,
} from 'react-native';

import AuthorProfile from './AuthorProfile';

var navigator = undefined;
var fb_token = undefined;

export default class PaperSummary extends Component<{}> {
	render() {
		fb_token = this.props.fb_token;
		navigator = this.props.navigator;
		const item = this.props.item;
		const title = item["title"][0];
		const link = item["link"][1]["$"]["href"];

		const summary = item["summary"][0];
		const author = item["author"].map(elm =>elm["name"][0]).join(",");
		const update_date = item["updated"][0];
		const publish_date = item["published"][0];
		const author_list = author.split(",").map((name)=>{return (<TouchableOpacity onPress={(author_name)=>{
			navigator.push({
				title: name,
				component: AuthorProfile,
				passProps: {name: name, fb_token: fb_token, navigator: navigator}
			});}}><Text style={styles.author}>{name}.</Text></TouchableOpacity>);});

		const share_button = ()=> {
		  Share.share({
		    message: 'I read this amazing paper "' + title.replace(/ +/g, " ").replace(/(?:\r\n|\r|\n)/g,"") + '"',
		    url: link,
		    title: 'Wow, did you see that?'
		  }, {
		    // Android only:
		    dialogTitle: 'Share BAM goodness',
		    // iOS only:
		    excludedActivityTypes: [
		      'com.apple.UIKit.activity.PostToTwitter'
		    ]
		  })
		}
		return (
			<View style={styles.container}>
				<View style={{flexDirection: 'row',flexWrap:'wrap'}}>
					<Text style={styles.title} onPress = {() =>{Linking.openURL(link);}}>{title.replace(/ +/g, " ").replace(/(?:\r\n|\r|\n)/g,"")}</Text>
				</View>
				<View style={{flexDirection: 'row',flexWrap:'wrap'}}>
					{author_list}
				</View>
				<Text style={styles.publish_date}>published @ {publish_date}</Text>
				<Text style={styles.update_date}>last update @ {update_date}</Text>
				<View style={{flexDirection:'row', flexWrap:'wrap'}}>
					<Text style={styles.summary}>{summary.replace(/ +/g, " ").replace(/(?:\r\n|\r|\n)/g,"")}</Text>
					<TouchableOpacity onPress={share_button}><Image source={{uri: "https://cdn0.iconfinder.com/data/icons/material-style/48/share_ios-512.png"}} style={styles.share}/></TouchableOpacity>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		padding: 20,
		marginTop: 120,
		alignItems: 'center'
	},
	title:{
		marginBottom: 10,
		fontSize: 20,
		color: '#000000'
	},
	share:{
		width:20,
		height:20,
		margin:2,
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


