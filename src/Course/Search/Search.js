import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    AsyncStorage,
    TextInput,
    ScrollView
} from 'react-native';
import Utils from "../../Store/Utils";
import CourseComponent from './CourseComponent/CourseComponent';
export default class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            keywords: '',
            list: [],
            text: '',
            isComponent: false
        }
    }
    componentDidMount () {
        this.LoadData();
    }
    async LoadData () {
        try {
            let keywords = await AsyncStorage.getItem('keywords');
            this.setState({
                list: JSON.parse(keywords) ? JSON.parse(keywords) : []
            })
        }
        catch (e) {
            console.log(e);
        }
    }

    render() {
        return (
            <View style={styles.content}>
                <View style={styles.messageHeader}>
                    <View style={styles.HeaderInput}>
                        <Image style={styles.SearchIcon} source={require('../../Image/Course/Search.png')}/>
                        <View style={{flex: 1}}>
                            <TextInput
                                style={styles.textInputs}
                                onChangeText={(text) =>this.setState({keywords: text})}
                                onSubmitEditing={this.onSubmitEditing.bind(this)}
                                placeholder={'搜索课程'}
                            />
                        </View>
                        {
                            this.state.keywords ?
                                <TouchableOpacity activeOpacity={0.8} onPress={this.OnInputCeart.bind(this)}>
                                    <Image style={styles.SearchIcon} source={require('../../Image/Video/close.png')}/>
                                </TouchableOpacity>
                                : null
                        }

                    </View>
                    <TouchableOpacity activeOpacity={0.8} onPress={this.onBackButton.bind(this)}>
                        <View style={styles.headerRight} >
                            <Text style={styles.headerRightText}>取消</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                { !this.state.isComponent ?
                    <View style={styles.content}>
                        <View style={styles.SearchMain}>
                            <View style={styles.SearchTitle}>
                                <View style={{flex: 1}}>
                                    <Text style={styles.SearchTitleText}>最近搜索</Text>
                                </View>
                                <TouchableOpacity activeOpacity={0.8} onPress={this.OnDel.bind(this)}>
                                    <Image style={styles.SearchTitleIcon} source={require('../../Image/Course/del.png')}/>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <ScrollView>
                            <View style={styles.content}>
                                <View style={styles.SearchMain}>
                                    {this.renderList()}
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                    :
                    <View style={styles.content}>
                        <CourseComponent navigation={this.props.navigation} keywords={this.state.text}/>
                    </View>
                }
            </View>
        );
    }
    renderList () {
        let List = [];
        if (this.state.list.length > 0) {
            this.state.list.forEach((v, i) => {
                List.push(
                    <TouchableOpacity activeOpacity={0.8} onPress={this.OnVideo.bind(this, v.keywords)} key={i}>
                        <View style={styles.SearchList}>
                            <Text style={styles.SearchListText}>{v.keywords}</Text>
                        </View>
                    </TouchableOpacity>
                )
            })
        }
        return List;
    }
    OnVideo (record) {
        this.setState({
            text: record,
            keywords: record,
            isComponent: true
        })
        // this.keywordsLoadData()
    }
    // 返回
    onBackButton () {
        this.props.navigation.goBack()
    }
    // 清除input
    OnInputCeart () {
        this.setState({
            keywords: '',
            isComponent: false
        })
    }
    OnDel () {
        AsyncStorage.removeItem('keywords');
        this.setState({
            list: []
        })
        this.forceUpdate()
    }
    onSubmitEditing () {
        if (this.state.list.length >= 5) {
            this.state.list.unshift({keywords: this.state.keywords, data: Number(new Date())});
            AsyncStorage.setItem('keywords',  JSON.stringify(this.state.list));
            this.setState({
                list: this.state.list.slice(0, 5)
            })
            this.forceUpdate()
        } else {
            this.state.list.unshift({keywords: this.state.keywords, data: Number(new Date())});
            AsyncStorage.setItem('keywords',  JSON.stringify(this.state.list));
            this.setState({
                list: this.state.list.slice(0, 5)
            })
            this.forceUpdate()
        }
        this.OnVideo(this.state.keywords)
    }
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        backgroundColor: '#fff',
    },
    messageHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: ( Utils.size.os === 'ios') ? 40 : 0,
        backgroundColor: '#fff',
    },
    messageHeaderTitle: {
        color: '#101010',
        fontWeight: 'bold',
        fontSize: Utils.setSpText(16),
    },
    messageHeaderBack: {
        width: 20,
        height: 20,
    },
    headerLeft: {
        width: 50,
    },
    headerRight: {
        width: 50,
        flexDirection:'row-reverse',
    },
    headerRightText: {
        color: '#000000',
        fontSize: Utils.setSpText(16),
    },
    HeaderInput: {
        height: 40,
        backgroundColor: '#F4F4F4',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
        paddingLeft: 15,
        paddingRight: 15,
    },
    SearchIcon: {
        width: 20,
        height: 20,
    },
    textInputs: {
        paddingLeft: 10,
        height: 40,
    },
    // 内容
    SearchMain: {
        paddingLeft: 10,
        paddingRight: 10,
    },
    SearchTitle: {
        paddingTop: 30,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    SearchTitleText: {
        color: '#000000',
        fontSize: Utils.setSpText(18),
    },
    SearchTitleIcon:{
        width: 20,
        height:22,
    },
    SearchList: {
        paddingTop: 20,
        paddingBottom: 20,
        borderBottomColor: '#EAEAEA',
        borderBottomWidth: 1,
    },
    SearchListText: {
        color: '#3D3D3D',
        fontSize: Utils.setSpText(16),
    }
});

