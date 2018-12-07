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

import PaperSummary from './PaperSummary';

var navigator = undefined;
var database = undefined;
var fb_token = undefined;
class ListItem extends React.PureComponent {
	constructor(props){
		super(props);
		this.itemsRef = database.ref();
	}

	_onPress = () => {
		this.itemsRef.push({ title: this.props.item["title"][0], url:this.props.item["link"][1]["$"]["href"],category:this.props.item["category"][0]["$"]["term"]});
		navigator.push({
				title: 'Abstract',
				component: PaperSummary,
				passProps: {item: this.props.item, fb_token: fb_token, navigator: navigator}
		});
		this.props.onPressItem(this.props.index);
	}


	render() {
		const item = this.props.item;
		const title = item["title"][0];
		const link = item["link"][1]["$"]["href"];

		const summary = item["summary"][0];
		const author = item["author"].map(elm =>elm["name"][0]).join(",");
		
		return (
				<TouchableHighlight
					onPress={this._onPress}
					underlayColor='#dddddd'>
						<View>
							<View style={styles.rowContainer}>
								<View style={styles.textContainer}>
									<Text 
										style={styles.title}
										>{title.replace(/ +/g, " ").replace(/(?:\r\n|\r|\n)/g,"")}</Text>
									<Text style={styles.author}>{author}</Text>
								</View>
							</View>
							<View style={styles.separator}/>
						</View>
				</TouchableHighlight>
		);
	}
}

export default class SearchResults extends Component<{}> {
	_keyExtractor = (item, index) => index;

	_renderItem = ({item, index}) => (
		<ListItem
			item={item}
			index={index}
			onPressItem={this._onPressItem}
			/>
	);

	_onPressItem = (index) => {
		console.log("Pressed row: "+index);
	};

	render() {
		navigator = this.props.listings.navigator;
		database = this.props.listings.database;
		fb_token = this.props.listings.fb_token;
		return (
			<FlatList
				data={this.props.listings.data}
				keyExtractor={this._keyExtractor}
				renderItem={this._renderItem}
			/>
		);
	}
}

const styles = StyleSheet.create({
	textContainer: {
		flex: 1
	},
	separator: {
		height: 1,
		backgroundColor: '#dddddd'
	},
	author:{
		fontSize: 10,
		fontWeight: 'bold',
		color: '#48BBEC',
	},
	title: {
		fontSize: 15,
		fontWeight: 'bold',
		color: '#000000'
	},
	summary: {
		fontSize: 10,
		color: '#656565'
	},
	rowContainer: {
		flexDirection: 'row',
		padding: 10
	},
});


