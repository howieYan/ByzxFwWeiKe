/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {View, Text, StyleSheet, Image, Animated, Easing, ScrollView, TouchableOpacity} from 'react-native'
import PageControl from 'react-native-page-control';
import Utils from '../Store/Utils';
import Banner from '../Component/Banner';
import { Loading } from '../Component/Loading';
export default class Course extends Component {
    constructor(props){
        super(props);
        this.state = {
            page: 1,
            size: 6,
            opacity: 0,
            SeowonList: [],
            VideoList: [],
            NavList: [],
            alertData: {
                leftName: '',
                rightName: '',
                centerName: '',
                alertTitle: '',
                alertContent: '',
                leftClick: null,
                rightClick: null,
                centerClick: null,
            },
            SeowonTotal: 0,
            currentPage: 0,
            pageCount: 2,
            ClassroomY: new Animated.Value(0),
        };
    }
    onScrollEvent = (event) => {
        let navHeight = (Utils.size.os === 'ios') ? 74 : 42;
        let offsetY = event.nativeEvent.contentOffset.y;
        let opacity = offsetY / navHeight
        this.setState({
            opacity: opacity
        })
    }
    componentDidMount() {
        this.LoadData()
    }
    async LoadData () {
        try {
            Loading.show('努力加载中...')
            let formData = new FormData();
            formData.append('page', this.state.page);
            formData.append('size', this.state.size);
            let NavList = await Utils.LoadPost(Utils.size.url + '/v1/course/classify'); // nav
            let SeowonList = await Utils.LoadPost(Utils.size.url + '/v1/course/getArticle', formData); // 书院课堂
            let VideoList = await Utils.LoadPost(Utils.size.url + '/v1/front/bestCourse', formData);  //今日推荐
            console.log(VideoList);
            if (Number(SeowonList.code) === 0 || Number(VideoList.code) === 0 || Number(NavList.code) === 0) {
                Loading.hidden();
                let pageCount = Math.ceil(NavList.result.length / 8)
                this.setState({
                    SeowonList: SeowonList.result.list,
                    VideoList: VideoList.result,
                    NavList: NavList.result,
                    pageCount: pageCount,
                })
                this.showSeowonBar(0, 5);         //从第0条开始，轮播5条数据
            } else {
                Loading.hidden();
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    showSeowonBar(index, count) {
        index++;
        Animated.timing(this.state.ClassroomY, {
            toValue: -30 * index,             //40为文本View的高度
            duration: 500,                        //动画时间
            Easing: Easing.linear,
            delay: 1500                            //文字停留时间
        }).start(() => {                          //每一个动画结束后的回调 
            if(index >= count) {
                index = 0;
                this.state.ClassroomY.setValue(0);
            }
            this.showSeowonBar(index, count);  //循环动画
        })
    }
    render() {
        return (
            <View style={styles.container}>
                <ScrollView
                    ref='scroll'
                    onScroll={this.onScrollEvent}
                    scrollEventThrottle={20}
                >
                    <View style={styles.swiperHei}>
                        <Banner navigator={this.props.navigator} height = {200}/>
                    </View>

                    <View style={{flex: 1}}>
                        <View style={styles.main}>
                            <View style={styles.mainNav}>
                                <ScrollView
                                    horizontal
                                    pagingEnabled
                                    automaticallyAdjustContentInsets={false}
                                    showsHorizontalScrollIndicator={false}
                                    onScroll={(e) => this.onScroll(e)}
                                >
                                    {this.renderListNav()}
                                </ScrollView>
                            </View>
                            <PageControl
                                style={styles.pageControl}
                                numberOfPages={this.state.pageCount}
                                currentPage={this.state.currentPage}
                                hidesForSinglePage
                                pageIndicatorTintColor='#ccc'
                                currentPageIndicatorTintColor={'red'}
                                indicatorSize={{width: 5, height: 5}}
                            />
                        </View>
                        <View style={{width: Utils.size.width,height: 5,backgroundColor: '#F6F6F6'}}/>
                        <View style={styles.mainSeowon}>
                            <Text style={styles.mainSeowonTitle}>书院</Text>
                            <View style={styles.mainSeowonSwiper}>
                                <Animated.View
                                    style={[{
                                        transform: [{
                                            translateY: this.state.ClassroomY
                                        }]}]}>
                                    {this.renderListBook()}
                                </Animated.View>
                            </View>
                        </View>
                        <View style={[styles.mainSeowon]}>
                            <Text style={[styles.mainSeowonTitle, styles.mainClassroom]}>课堂</Text>
                            <View style={styles.mainSeowonSwiper}>
                                <Animated.View
                                    style={[{
                                        transform: [{
                                            translateY: this.state.ClassroomY
                                        }]}]}>
                                    {this.renderListBook()}
                                </Animated.View>
                            </View>
                        </View>
                        <View style={{width: Utils.size.width,height: 5,backgroundColor: '#F6F6F6'}}/>
                        <View style={styles.mainVideo}>
                            <Text style={styles.mainVideoTitle}>今日推荐</Text>
                            <View style={styles.VideoNav}>
                                {this.renderRecommendList()}
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <View style={[styles.messageHeader, { backgroundColor: `rgba(16,94,174, ${this.state.opacity})`}]} >
                    <TouchableOpacity activeOpacity={0.8} onPress={this.OnSearch.bind(this)}>
                        <View style={styles.headerSearchTitle}>
                            <Image style={styles.SearchIcon} source={require('../Image/Course/Search.png')}/>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
    onScroll = (e) => {
        let x = e.nativeEvent.contentOffset.x
        let currentPage = Math.round(x / Utils.size.width)
        if (this.state.currentPage !== currentPage) {
            this.setState({
                currentPage: currentPage
            })
        }
    }
    // 今日推荐
    renderRecommendList () {
        let Total = this.state.VideoList.length;
        let List = [];
        if (Total > 0) {
            this.state.VideoList.forEach((v, i) => {
                List.push(
                    <TouchableOpacity key={i} activeOpacity={0.5} onPress={this.onRecommendButton.bind(this, v,)}>
                        <View style={styles.VideoNavLeft}>
                            <View style={ i % 2 === 0 ? styles.VideoNavPadd : styles.VideoNavPaddRight}>
                                <Image source={{uri: v.pg_thumb}} style={styles.VideoNavLeftImg}/>
                                <Text style={styles.VideoNavLeftText} numberOfLines={1}>{v.pg_title}</Text>
                                <View style={styles.VideoNavTextState}>
                                    <Text style={styles.VideoNavLeftMoney}>{'¥' } {v.pg_price}</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                )
            });
        }
        return List;
    }
    // 书院
    renderListBook () {
        let Total = this.state.SeowonList.length;
        let List = [];
        if (Total > 0) {
            this.state.SeowonList.forEach((v, i) => {
                List.push(
                    <TouchableOpacity key={i} activeOpacity={0.5} onPress={this.onBookButton.bind(this, v)}>
                        <View style={styles.mainSeowonSwiperBar}>
                            <View style={styles.mainSeowonSwiperBarHong}/>
                            <Text style={styles.mainSeowonSwiperBarText}>{v.art_title}</Text>
                        </View>
                    </TouchableOpacity>
                )
            });
        }
        return List;
    }
    // nav
    renderListNav () {
        let {NavList, pageCount} = this.state
        if (this.state.NavList.length > 0) {
            let menuItems = NavList.map((v, i) => (
                <TouchableOpacity key={i} activeOpacity={0.5} onPress={this.onNavButton.bind(this, v)}>
                    <View style={styles.mainNavContent} >
                        <Image style={styles.mainNavContentImg} source={{uri: v.pc_mobile_icon}}/>
                        <Text style={styles.mainNavContentText}>{v.pc_name}</Text>
                    </View>
                </TouchableOpacity>
            ));
            let menuViews = []
            for (let i = 0; i < pageCount; i++) {
                let items = menuItems.slice(i * 8, i * 8 + 8)
                let menuView = (
                    <View style={styles.mainNav} key={i}>
                        {items}
                    </View>
                )
                menuViews.push(menuView)
            }
            return menuViews;
        }
    }
    // banner 下nav
    onNavButton (record) {
        this.props.navigation.navigate('BigData', {name: record.pc_name, catId: record.pc_id,})
    }
    // 书院
    onBookButton (record) {
        this.props.navigation.navigate('BookAcademy', {name: record.ac_name, artId: record.art_id,})
    }
    // 今日推荐
    onRecommendButton (record) {
        this.props.navigation.navigate('RecommendVideo', {name: record.pg_title, pgId: record.pg_id})
    }
    // 搜索
    OnSearch () {
        this.props.navigation.navigate('Search')
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
    },
    content: {
        flex: 1,
        backgroundColor: '#fff',
    },
    messageHeader: {
        position: 'absolute',
        width: Utils.size.width,
        zIndex: 10,
        height: (Utils.size.os === 'ios') ? 74 : 42,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: ( Utils.size.os === 'ios') ? 20 : 0,
        backgroundColor: '#4089D5',
    },
    swiperHei: {
        height: Utils.size.os === 'ios' ? 220 : 160
    },
    SwiperImg: {
        width: '100%',
        height: Utils.size.os === 'ios' ? 220 : 160
    },
    headerSearchTitle: {
        height: Utils.size.os === 'ios' ? 35 : 30,
        width: Utils.size.width - 80,
        backgroundColor: '#fff',
        borderRadius: 20,
        justifyContent: 'center',
    },
    SearchIcon: {
        marginLeft: 20,
        width: 15,
        height: 15,
    },
    main: {
        backgroundColor: '#fff',
        paddingTop: 10,
        width: Utils.size.width,
    },
    mainNav: {
        width: Utils.size.width,
        flexDirection:'row',
        flexWrap:'wrap'
    },
    mainNavContent: {
        width: Utils.size.width / 4,
        height: Utils.size.width / 4,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 10,
    },
    mainNavContentImg: {
        width: Utils.size.width / 7,
        height: Utils.size.width / 7,
        borderRadius: (Utils.size.width / 7) / 2,
    },
    mainNavContentText: {
        paddingTop: 10,
        color: '#5D5D5D',
        fontSize: Utils.setSpText(12),
    },
    mainSeowon: {
        // height: 40,
        backgroundColor: '#fff',
        alignItems: 'center',
        flexDirection: 'row',
        paddingLeft: 10,
        paddingRight: 10,
    },
    mainSeowonTitle: {
        color: '#000',
        fontSize: Utils.setSpText(20),
    },
    mainSeowonSwiper: {
        height: 30,
        paddingLeft: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
        overflow: 'hidden',
    },
    mainSeowonSwiperBar: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        overflow: 'hidden',
        height: 30,
        alignItems: 'center',
        // justifyContent: 'center',
    },
    mainSeowonSwiperBarHong: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#FD0000'
    },
    mainSeowonSwiperBarText: {
        paddingLeft: 10,
        color: '#5E5E5E',
        fontSize: Utils.setSpText(13),
    },
    mainClassroom: {
        color: '#FD0000'
    },
    mainVideo: {
        backgroundColor: '#fff',
    },
    mainVideoTitle: {
        fontSize: Utils.setSpText(16),
        color: '#000',
        paddingBottom: 10,
        paddingTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
    },
    VideoNav: {
        flexDirection:'row',
        flexWrap:'wrap'
    },
    VideoNavLeft: {
        paddingTop: 10,
        width: Utils.size.width / 2,
        justifyContent: 'center',
    },
    VideoNavPadd: {
        paddingLeft: 10,
        paddingRight: 5
    },
    VideoNavPaddRight: {
        paddingLeft: 5,
        paddingRight: 10
    },
    VideoNavLeftImg: {
        width: '100%',
        borderRadius: 3,
        height: 100
    },
    VideoNavLeftText: {
        paddingTop: 10,
        fontSize: Utils.setSpText(16),
        color: '#000',
    },
    VideoNavTextState: {
        paddingTop: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    VideoNavLeftMoney: {
        fontSize: Utils.setSpText(14),
        color: '#FF0000',
    },
    VideoNavLeftTime: {
        paddingLeft: 10,
        color: '#a7a7a7',
        fontSize: Utils.setSpText(12)
    },
    pageControl: {
        margin: 10,
    }

});
