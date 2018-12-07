'use strict';

import React, { Component } from 'react'
import {
  StyleSheet,
  Image,
  View,
  Linking,
  ListView,
  TouchableHighlight,
  FlatList,
  Text,
} from 'react-native';

export default class History extends Component<{}> {
	constructor(props) {
		super(props);
		this.itemsRef = this.props.database.ref();
		this.state = {
			isLoading:false
		}
	}

	listenForItems(itemsRef) {
		var items = [];
	    itemsRef.on('value', (snap) => {
	      snap.forEach((child) => {
	        items.push({
	          title: child.val().title,
	          url:child.val().url,
	          category:child.val().category,
	          _key: child.key
	        });
	      });
	      this.setState({dataSource:items,isLoading:false});  
	    });

	}

	componentDidMount() {
		this.setState({dataSource:[], isLoading:true});
    	this.listenForItems(this.itemsRef);
  	}

	render() {
		if(this.state.isLoading){return null;}
		else{
			return (
			<View style={styles.container}>
				<FlatList data={this.state.dataSource} renderItem={({item}) => <Text style={styles.historyTitle}>{item.title.replace(/ +/g, " ").replace(/(?:\r\n|\r|\n)/g,"")}</Text>}/>
			</View>
			);
		}
		
	}
}

const styles = StyleSheet.create({
	container: {
		flex:1,
		padding: 30,
		marginTop: 30,
		alignItems: 'center'
	},
	historyTitle:{
		fontSize:18,
		marginBottom:10,
		color: '#870000',
	},
});