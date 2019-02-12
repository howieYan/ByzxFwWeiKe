import React, {Component} from 'react';
import {
    View,
    Text,
    Slider,
    Image,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    AsyncStorage, TouchableWithoutFeedback, Animated, Alert, NativeModules, Modal
} from 'react-native';
import Utils from "../../Store/Utils";
import {Loading} from "../../Component/Loading";
import ScrollableTabView from "react-native-scrollable-tab-view";
import CustomTabBar from "../../Component/CourseComponent/Component/CustomTabBar";
import Directory from '../../Component/VideoComponent/Directory';
import Introduce from '../../Component/VideoComponent/Introduce';
import Video from "react-native-video";
import Orientation from "react-native-orientation";
import DeviceInfo from "react-native-device-info";
import * as WeChat from 'react-native-wechat';
import AlertView from "../../Component/Alert";
const {InAppUtils} = NativeModules
function formatTime(second) {
    let h = 0, i = 0, s = parseInt(second);
    if (s > 60) {
        i = parseInt(s / 60);
        s = parseInt(s % 60);
    }
    // 补零
    let zero = function (v) {
        return (v >> 0) < 10 ? "0" + v : v;
    };
    return [zero(h), zero(i), zero(s)].join(":");
}

export default class RecommendVideo extends Component {
    constructor() {
        super();
        this.player = null;
        let url = encodeURI('http://123.56.248.164:9080/宣传视频/北邮在线教学.mp4')
        this.state = {
            propsData: {},
            Uid: null,
            data: {},
            modalVisible: false,
            flag: true,
            VideoList: {},
            collection: null,
            isBuy: null,
            VideoUrl: "",
            videoUrl: url,
            videoCover: "https://bywk.qcdqnet.com/uploads/image/201810/432986439193205370.jpg",
            videoWidth: Utils.size.width,
            videoHeight: Utils.size.width * 9 / 16, // 默认16：9的宽高比
            showVideoCover: true,    // 是否显示视频封面
            showVideoControl: false, // 是否显示视频控制组件
            isPlaying: false,        // 视频是否正在播放
            currentTime: 0,        // 视频当前播放的时间
            duration: 0,           // 视频的总时长
            isFullScreen: false,     // 当前是否全屏显示
            playFromBeginning: false, // 是否从头开始播放
            alertData: {
                leftName: '',
                rightName: '',
                centerName: '',
                alertTitle: '',
                alertContent: '',
                leftClick: null,
                rightClick: null,
                centerClick: null,
            }
        };

    }

    componentDidMount() {
        WeChat.registerApp('wx445a10ea5285fe46');
        this.setState({
            propsData: this.props.navigation.state.params
        })
        this.LoadData();
    }

    componentDidUpdate() {
        // this.forceUpdate()
    }

    componentWillMount() {
        // this.forceUpdate()
    }

    async LoadData() {
        try {
            let Uid = await AsyncStorage.getItem('uId');
            let formData = new FormData();
            formData.append('pgId', this.state.propsData.pgId);
            formData.append('uId', Uid);
            let data = await Utils.LoadPost(Utils.size.url + '/v1/course/detail', formData);
            console.log(data);
            if (Number(data.code) === 0) {
                this.setState({
                    data: data.result,
                    collection: data.result.collection,
                    isBuy: data.result.isBuy,
                    Uid: Uid,
                })
                if (data.result.video.length > 0) {
                    let VideoList = data.result.video.find((element) => (Number(element.pv_try_preview) === 1));
                    if (VideoList !== 'undefined') {
                        this.setState({
                            VideoList: VideoList,
                            VideoUrl: encodeURI(VideoList.pv_url),
                            videoCover: VideoList.pv_thumb
                        })
                    }
                }

            }
        } catch (e) {
            console.log(e);
        }
    }

    render() {
        return (
            <View style={[styles.content]}>
                {
                    Utils.size.os === 'ios'
                        ?
                        null
                        :
                        !this.state.isFullScreen ? null :
                            <StatusBar hidden={true}/>
                }
                <View style={styles.container} onLayout={this._onLayout}>
                    <View style={{
                        width: this.state.videoWidth,
                        height: this.state.videoHeight,
                        backgroundColor: '#000000'
                    }}>
                        <Video
                            ref={(ref) => this.videoPlayer = ref}
                            source={{uri: this.state.videoUrl}}
                            rate={1.0}
                            volume={1.0}
                            muted={false}
                            paused={!this.state.isPlaying}
                            resizeMode={'contain'}
                            playWhenInactive={false}
                            playInBackground={false}
                            ignoreSilentSwitch={'ignore'}
                            progressUpdateInterval={250.0}
                            onLoadStart={this._onLoadStart}
                            onLoad={this._onLoaded}
                            onProgress={this._onProgressChanged}
                            onEnd={this._onPlayEnd}
                            onError={this._onPlayError}
                            onBuffer={this._onBuffering}
                            style={{width: this.state.videoWidth, height: this.state.videoHeight}}
                        />
                        {
                            this.state.showVideoCover ?
                                <Image
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: this.state.videoWidth,
                                        height: this.state.videoHeight
                                    }}
                                    resizeMode={'cover'}
                                    source={{uri: this.state.videoCover}}
                                /> : null
                        }
                        <TouchableWithoutFeedback onPress={() => {
                            this.hideControl()
                        }}>
                            <View
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: this.state.videoWidth,
                                    height: this.state.videoHeight,
                                    backgroundColor: this.state.isPlaying ? 'transparent' : 'rgba(0, 0, 0, 0.2)',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                {
                                    this.state.isPlaying ? null :
                                        <TouchableWithoutFeedback onPress={() => {
                                            this.onPressPlayButton(this.state.VideoList)
                                        }}>
                                            <Image
                                                style={styles.playButton}
                                                source={require('../../Image/Video/player.png')}
                                            />
                                        </TouchableWithoutFeedback>
                                }
                            </View>
                        </TouchableWithoutFeedback>
                        {
                            this.state.showVideoControl ?
                                <View style={[styles.control, {width: this.state.videoWidth}]}>
                                    <TouchableOpacity activeOpacity={0.3} onPress={() => {
                                        this.onControlPlayPress(this.state.VideoList)
                                    }}>
                                        <Image
                                            style={styles.playControl}
                                            source={this.state.isPlaying ? require('../../Image/Video/base.png') : require('../../Image/Video/player.png')}
                                        />
                                    </TouchableOpacity>
                                    <Text
                                        style={styles.time}>{formatTime(this.state.currentTime)}</Text>
                                    <Slider
                                        style={{flex: 1}}
                                        maximumTrackTintColor={'#999999'}
                                        minimumTrackTintColor={'#00c06d'}
                                        thumbImage={require('../../Image/Video/icon_control_slider.png')}
                                        value={this.state.currentTime}
                                        minimumValue={0}
                                        maximumValue={this.state.duration}
                                        onValueChange={(currentTime) => {
                                            this.onSliderValueChanged(currentTime)
                                        }}
                                    />
                                    <Text
                                        style={styles.time}>{formatTime(this.state.duration)}</Text>
                                    <TouchableOpacity activeOpacity={0.3} onPress={() => {
                                        this.onControlShrinkPress()
                                    }}>
                                        <Image
                                            style={styles.shrinkControl}
                                            source={this.state.isFullScreen ? require('../../Image/Video/icon_control_shrink_screen.png') : require('../../Image/Video/icon_control_full_screen.png')}
                                        />
                                    </TouchableOpacity>
                                </View> : null
                        }
                        {
                            this.state.showVideoControl ?
                                <View style={[styles.controlTop, {
                                    height: DeviceInfo.getDeviceName() === 'iPhone X' ? 74 : 54,
                                    paddingTop: DeviceInfo.getDeviceName() === 'iPhone X' ? 20 : 14,
                                }]}>
                                    <TouchableOpacity activeOpacity={0.8}
                                                      navigator={this.props.navigator}
                                                      onPress={this.onBackButton.bind(this)}>
                                        <View style={styles.headerLeft}>
                                            <Image
                                                style={styles.messageHeaderBack}
                                                source={require('../../Image/Backfff.png')}
                                            />
                                        </View>
                                    </TouchableOpacity>
                                    <Animated.Text numberOfLines={1}
                                                   style={[styles.messageHeaderTitle]}>{this.state.VideoList.pv_title}</Animated.Text>
                                </View> : null
                        }
                    </View>
                    <View style={{flex: 1,}}>
                        {/*<ScrollView>*/}
                        <View style={styles.VideoMain}>
                            <Text style={styles.VideoTitle}
                                  numberOfLines={2}>{this.state.data.pg_title}</Text>
                            <View style={styles.VideoMainUserMoney}>
                                <Text
                                    style={styles.VideoOnUser}>{this.state.data.pg_sales}人学习过</Text>
                                <Text
                                    style={styles.VideoMoney}>¥{this.state.data.pg_price}</Text>
                            </View>
                        </View>
                        <View style={styles.VideoMainBottom}>
                            <TouchableOpacity activeOpacity={0.8}
                                              onPress={this.OnNavShare.bind(this)}>
                                <View style={styles.VideoMainFlex}>
                                    <Image style={styles.VideoMainFlexShareImg}
                                           source={require('../../Image/Video/Share.png')}/>
                                    <Text style={styles.VideoMainFlexText}>分享</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.8}
                                              onPress={this.OnNavCollect.bind(this, this.state.collection)}>
                                <View style={styles.VideoMainFlex}>
                                    <Image style={styles.VideoMainFlexShareImg}
                                           source={!Number(this.state.collection === 1) ? require('../../Image/Video/Collect.png') : require('../../Image/Video/CollectActive.png')}/>
                                    <Text
                                        style={!Number(this.state.collection === 1) ? styles.VideoMainFlexText : styles.VideoMainFlexTextActive}>收藏</Text>
                                </View>
                            </TouchableOpacity>
                            <View style={styles.VideoMainFlex}>
                                <TouchableOpacity activeOpacity={0.8}
                                                  navigator={this.props.navigator}
                                                  onPress={this.onPlayerVideo.bind(this, this.state.VideoList)}>
                                    <Image style={styles.VideoMainFlexImg}
                                           source={this.state.VideoUrl ? require('../../Image/Video/AndSeeActive.png') : require('../../Image/Video/AndSee.png')}/>
                                    <Text
                                        style={this.state.VideoUrl ? styles.VideoMainFlexText : styles.VideoMainFlexTextActiveAndce}>试看</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{
                            width: Utils.size.width,
                            height: 5,
                            backgroundColor: '#F6F6F6'
                        }}/>
                        <View style={[styles.content]}>
                            <ScrollableTabView style={styles.content}
                                               renderTabBar={() =>
                                                   <CustomTabBar
                                                       backgroundColor={'#fff'}
                                                       tabUnderlineDefaultWidth={20} // default containerWidth / (numberOfTabs * 4)
                                                       tabUnderlineScaleX={2} // default 3
                                                       activeColor={"#0077C3"}
                                                       inactiveColor={"#333333"}
                                                       style={{width: 150}}
                                                   />}
                                               tabBarBackgroundColor='#FFFFFF'>
                                <Introduce style={styles.content} navigator={this.props.navigator}
                                           data={this.state.data} type={this.state.propsData.type}
                                           tabLabel='介绍'/>
                                <Directory style={styles.content} navigator={this.props.navigator}
                                           data={this.state.data} type={this.state.propsData.type}
                                           onPlayerVideo={this.onPlayerVideo.bind(this)}
                                           tabLabel='目录'/>
                            </ScrollableTabView>
                        </View>
                        {/*</ScrollView>*/}
                        <View style={styles.VideoBottomNav}>
                            <View style={styles.VideoBottomNavLeft}>
                                <TouchableOpacity activeOpacity={0.8}
                                                  onPress={this.OnNavCustomer.bind(this)}>
                                    <View style={{flexDirection: 'row'}}>
                                        <Image source={require('../../Image/Video/Customer.png')}
                                               style={styles.VideoBottomNavLeftImg}/>
                                        <Text style={styles.VideoBottomNavLeftText}>联系客服</Text>
                                    </View>
                                </TouchableOpacity>

                            </View>
                            <View style={styles.VideoBottomNavRight}>
                                <TouchableOpacity activeOpacity={0.8}
                                                  onPress={this.OnNavBuyNow.bind(this, this.state.VideoList)}>
                                    <Text style={styles.VideoBottomNavRightText}>{Number(this.state.isBuy) === 0 ? '立即购买' : '立即学习'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
                {this._renderAndroidAlert()}
                <Modal
                    animationType="slide"
                    transparent={true}
                    style={styles.modalStyle}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        alert("Modal has been closed.");
                    }}
                >
                    <View style={[styles.content, styles.modalStyle]}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalHeaderLeft}>下单确认</Text>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.setModalVisible(!this.state.modalVisible);
                                    }}
                                >
                                    <Text style={styles.modalHeaderRight}>取消</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.modalContentPadd}>
                                <View style={styles.modalContentPrice}>
                                    <Text style={styles.modalContentPriceLeft}>{this.state.data.pg_title}</Text>
                                </View>
                                <View style={styles.modalContentPrice}>
                                    <Text style={styles.modalContentPriceLeft}>价格</Text>
                                    <Text style={[styles.modalContentPriceRight, styles.VideoMoney]}>¥{this.state.data.pg_price}</Text>
                                </View>

                            </View>
                            <TouchableOpacity activeOpacity={0.5} onPress={this.onBuy.bind(this)}>
                                <View style={styles.modalButton}>
                                    <Text
                                        style={styles.modalButtonText}>确认购买</Text>
                                </View>
                            </TouchableOpacity>

                        </View>
                    </View>
                </Modal>
            </View>
        );
    }

    // 弹窗
    _renderAndroidAlert() {
        return (
            <AlertView ref='alert'
                       leftName={this.state.alertData.leftName}
                       rightName={this.state.alertData.rightName}
                       centerName={this.state.alertData.centerName}
                       alertTitle={this.state.alertData.alertTitle}
                       alertContent={this.state.alertData.alertContent}
                       leftClick={this.state.alertData.leftClick}
                       rightClick={this.state.alertData.rightClick}
                       centerClick={this.state.alertData.centerClick}
            />
        );

    }

    // 返回
    onBackButton() {
        if (this.state.isFullScreen) {
            Orientation.lockToPortrait()
        } else {
            this.props.navigation.goBack()
        }
    }

    // 分享
    OnNavShare() {
        this.setState({
            alertData: {
                leftName: '微信',
                rightName: '取消',
                centerName: '朋友圈',
                alertTitle: '提示',
                alertContent: '选择分享方式',
                leftClick: this.onWechat.bind(this),
                rightClick: this.rightClick.bind(this),
                centerClick: this.onFriends.bind(this)
            }
        })
        this.refs.alert && this.refs.alert.showDialog();
    }

    // 取消弹窗
    rightClick = () => {
        this.refs.alert && this.refs.alert.hideAlertView();
    }

    // 微信好友
    async onWechat() {
        try {
            let data = await WeChat.isWXAppInstalled();
            if (data) {
                let Share = await WeChat.shareToSession(
                    {
                        title: '泛网微课',
                        description: this.state.data.pg_title,
                        thumbImage: this.state.data.pg_thumb,
                        type: 'news',
                        webpageUrl: Utils.size.url + 'share/video/' + this.state.propsData.pgId
                    }
                )
                if (Number(Share.errCode) === 0) {
                    Loading.Toast('分享成功')
                } else {
                    Loading.Toast('分享失败')
                }
            } else {
                Loading.Toast('请安装微信');
            }
        } catch (e) {
            console.log(e);
        }
    }

    // 朋友圈
    async onFriends() {
        try {
            let data = await WeChat.isWXAppInstalled();
            if (data) {
                let Share = await WeChat.shareToTimeline(
                    {
                        title: '泛网微课',
                        description: this.state.data.pg_title,
                        thumbImage: this.state.data.pg_thumb,
                        type: 'news',
                        webpageUrl: Utils.size.url + 'share/video/' + this.state.propsData.pgId
                    }
                )
                if (Number(Share.errCode) === 0) {
                    Loading.Toast('分享成功')
                } else {
                    Loading.Toast('分享失败')
                }
            } else {
                Loading.Toast('请安装微信');
            }
        } catch (e) {
            console.log(e);
        }
    }

    // 收藏
    OnNavCollect(isCollect) {
        if (!this.state.Uid) {
            this.IsLogin();
        } else {
            if (Number(this.state.collection) === 1) {
                this.LoaddDelCollection();
            } else {
                this.LoadSetCollection();
            }
        }
    }

    // 是否登录的弹窗
    IsLogin() {
        this.setState({
            alertData: {
                leftName: '确定',
                rightName: '取消',
                alertTitle: '提示',
                alertContent: '您还没有登录，是否确定登录',
                leftClick: this.ToLogin.bind(this),
                rightClick: this.rightClick.bind(this),
            }
        })
        this.refs.alert && this.refs.alert.showDialog();
    }

    // 取消收藏
    async LoaddDelCollection() {
        try {
            let formData = new FormData();
            formData.append('pgId', this.state.propsData.pgId);
            formData.append('uId', this.state.Uid);
            let data = await Utils.LoadPost(Utils.size.url + '/v1/account/delCollection', formData);
            if (Number(data.code) === 0) {
                this.setState({
                    collection: 0
                })
                this.forceUpdate()
                Loading.Toast('取消收藏');
            } else {
                Loading.Toast(data.message);
            }
        } catch (e) {
            console.log(e);
        }
    }

    // 收藏成功
    async LoadSetCollection() {
        try {
            let formData = new FormData();
            formData.append('pgId', this.state.propsData.pgId);
            formData.append('uId', this.state.Uid);
            let data = await Utils.LoadPost(Utils.size.url + '/v1/account/setCollection', formData);
            if (Number(data.code) === 0) {
                this.setState({
                    collection: 1
                })
                this.forceUpdate()
                Loading.Toast('收藏成功');
            } else {
                Loading.Toast(data.message);
            }
        } catch (e) {
            console.log(e);
        }
    }

    // 立即购买
    OnNavBuyNow(record) {
        if (Number(this.state.isBuy) === 0) {
            if (Utils.size.os === 'ios') {
                if (!this.state.Uid) {
                    this.IsLogin();
                } else {
                    this.onMyData(record)
                }
            } else {
                if (!this.state.Uid) {
                    this.IsLogin();
                } else {
                    this.props.navigation.navigate('PaymentOrder', {
                        name: '支付订单',
                        pgId: this.state.propsData.pgId,
                        data: this.state.data,
                    })
                }
            }
        } else {
            this.onPressPlayButton(record);
        }
    }
    // 获取个人信息
    async onMyData() {
        try {
            let formData = new FormData();
            formData.append('uId', this.state.Uid);
            let data = await Utils.LoadPost(Utils.size.url + '/v1/account/getUserInfo', formData);
            console.log(data.result.u_balance);
            if (Number(data.code) === 0) {
                if (Number(data.result.u_balance) < Number(this.state.data.pg_price)) {
                    Alert.alert(
                        '提示',
                        '您的金额不足以支付，请你充值',
                        [
                            {text: '取消', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                            {text: '确认', onPress: () => this.onTopUp()},
                        ],
                        {cancelable: false}
                    )
                } else {
                    this.setModalVisible(true);
                    // this.IosAppPurchase()
                }
            } else {
                Loading.Toast(data.message);
            }
        } catch (e) {
            console.log(e)
        }
    }
    // 关闭model
    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }
    // 确认购买
    onBuy () {
        this.IosAppPurchase();
    }
    async IosAppPurchase  () {
        try {
            let Uid = await AsyncStorage.getItem('uId');
            let formData = new FormData();
            formData.append('pgId', this.state.propsData.pgId);
            formData.append('uId', Uid);
            formData.append('payType', 3);
            let data = await Utils.LoadPost(Utils.size.url + '/v1/course/addOrder', formData);
            console.log(data)
            if (Number(data.code) === 0) {
                this.LoadWechatPay(data.result)
            } else {
                Loading.Toast(data.message);
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    // 购买
    async LoadWechatPay (record) {
        try {
            let formData = new FormData();
            formData.append('orderId', record.of_id);
            formData.append('uId', record.u_id);
            formData.append('payType', record.of_pay_type);
            console.log(formData)
            let data = await Utils.LoadPost(Utils.size.url + '/v1/course/addPay', formData);
            console.log(data);
            if (Number(data.code) === 0) {
                Loading.Toast('购买成功');
                this.setModalVisible(!this.state.modalVisible);
                this.LoadData();
            } else {
                Loading.Toast(data.message);
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    // 跳转充值
    onTopUp() {
        this.props.navigation.navigate('MyBalance', {name: '我的余额',})
    }


    onHelpFeedback() {
        this.props.navigation.navigate('HelpFeedback', {name: '帮助与反馈'})
    }

    // 客服
    OnNavCustomer() {
        this.setState({
            alertData: {
                leftName: '确定',
                rightName: '取消',
                alertTitle: '提示',
                alertContent: '企业官网QQ：3145582524 北邮在线IT教育 微信：18629312489  微信号：beiyouzx 北邮在线IT教育 QQ：3145582524',
                leftClick: this.rightClick.bind(this),
                rightClick: this.rightClick.bind(this),
            }
        })
        this.refs.alert && this.refs.alert.showDialog();
    }

    // 登录页面
    ToLogin() {
        this.props.navigation.navigate('Login')
    }

    // 试看
    onPlayerVideo(record) {
        this.setState({
            VideoList: record,
        })
        this.onPressPlayButton(record)
    }

    OnAlert() {
        Loading.Toast('您不能试看')
    }

    _onLoadStart = () => {
        // console.log('视频开始加载');
    };

    _onBuffering = () => {
        // console.log('视频缓冲中...')
    };

    _onLoaded = (data) => {
        // console.log('视频加载完成');
        this.setState({
            duration: data.duration,
        });
    };

    _onProgressChanged = (data) => {
        // console.log('视频进度更新');
        // console.log(this.state.videoHeight);
        if (this.state.isPlaying) {
            this.setState({
                currentTime: data.currentTime,
            })
        }
    };

    _onPlayEnd = () => {
        // console.log('视频播放结束');
        this.setState({
            currentTime: 0,
            isPlaying: false,
            playFromBeginning: true
        });
    };

    _onPlayError = () => {
        // console.log('视频播放失败');
    };

    ///-------控件点击事件-------

    /// 控制播放器工具栏的显示和隐藏
    hideControl() {
        if (this.state.showVideoControl) {
            this.setState({
                showVideoControl: false,
            })
        } else {
            this.setState(
                {
                    showVideoControl: true,
                },
                // 5秒后自动隐藏工具栏
                () => {
                    setTimeout(
                        () => {
                            this.setState({
                                showVideoControl: false
                            })
                        }, 5000
                    )
                }
            )
        }
    }

    /// 点击了播放器正中间的播放按钮
    onPressPlayButton(record) {
        if (!this.state.Uid) {
            if (record.pv_url) {
                if (Number(record.pv_try_preview) === 2) {
                    Loading.Toast('此章节不能试看')
                } else {
                    this.setState({
                        isPlaying: true,
                        showVideoCover: false,
                        videoUrl: encodeURI(record.pv_url)
                    });
                    if (this.state.playFromBeginning) {
                        this.videoPlayer.seek(0);
                        this.setState({
                            playFromBeginning: false,
                        })
                    }
                }
            } else {
                this.OnAlert();
            }
        } else {
            if (record.pv_url) {
                if (Number(record.pv_try_preview) === 2) {
                    this.OnAlert();
                } else {
                    this.setState({
                        isPlaying: true,
                        showVideoCover: false,
                        videoUrl: encodeURI(record.pv_url)
                    });
                    if (this.state.playFromBeginning) {
                        this.videoPlayer.seek(0);
                        this.setState({
                            playFromBeginning: false,
                        })
                    }
                }
            } else {
                this.OnAlert();
            }
        }

    }

    /// 点击了工具栏上的播放按钮
    onControlPlayPress(record) {
        if (record.pv_url) {
            if (Number(record.pv_try_preview) === 2) {
                this.OnAlert();
            } else {
                this.setState({
                    isPlaying: !this.state.isPlaying,
                    showVideoCover: false,
                    videoUrl: encodeURI(record.pv_url)
                });
                if (this.state.playFromBeginning) {
                    this.videoPlayer.seek(0);
                    this.setState({
                        playFromBeginning: false,
                    })
                }
            }
            this.forceUpdate()
        } else {
            this.OnAlert();
        }
    }

    /// 点击了工具栏上的全屏按钮
    onControlShrinkPress() {
        if (this.state.isFullScreen) {
            Orientation.lockToPortrait();
        } else {
            Orientation.lockToLandscape();
        }
    }

    /// 进度条值改变
    onSliderValueChanged(currentTime) {
        this.videoPlayer.seek(currentTime);
        if (this.state.isPlaying) {
            this.setState({
                currentTime: currentTime
            })
        } else {
            this.setState({
                currentTime: currentTime,
                isPlaying: true,
                showVideoCover: false
            })
        }
    }

    /// 屏幕旋转时宽高会发生变化，可以在onLayout的方法中做处理，比监听屏幕旋转更加及时获取宽高变化
    _onLayout = (event) => {
        //获取根View的宽高
        let {width, height} = event.nativeEvent.layout;
        console.log('通过onLayout得到的宽度：' + width);
        console.log('通过onLayout得到的高度：' + height);

        // 一般设备横屏下都是宽大于高，这里可以用这个来判断横竖屏
        let isLandscape = (width > height);
        if (isLandscape) {
            this.setState({
                videoWidth: width,
                videoHeight: height,
                isFullScreen: true,
            })
        } else {
            this.setState({
                videoWidth: width,
                videoHeight: width * 9 / 16,
                isFullScreen: false,
            })
        }
        Orientation.unlockAllOrientations();
    };
}
const styles = StyleSheet.create({
    content: {
        flex: 1,
        backgroundColor: '#fff',
    },
    // 内容
    VideoMain: {
        backgroundColor: '#fff',
        paddingLeft: 10,
        paddingRight: 10,
    },
    VideoTitle: {
        paddingTop: 10,
        fontSize: Utils.setSpText(16),
        color: '#000',
    },
    VideoMainUserMoney: {
        paddingTop: 10,
        flexDirection: 'row',
    },
    VideoOnUser: {
        fontSize: Utils.setSpText(14),
        color: '#C5C5C5',
    },
    VideoMoney: {
        paddingLeft: 20,
        color: '#ED0816',
        fontSize: Utils.setSpText(14),
    },
    VideoMainBottom: {
        width: Utils.size.width,
        paddingTop: 20,
        flexDirection: 'row',
        paddingBottom: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    VideoMainFlex: {
        width: Utils.size.width / 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    VideoMainFlexShareImg: {
        width: 18,
        height: 18,
    },
    VideoMainFlexCollectImg: {
        width: 22,
        height: 22,
    },
    VideoMainFlexImg: {
        width: 18,
        height: 18,
    },
    VideoMainFlexText: {
        paddingTop: 10,
        color: '#323232',
        fontSize: Utils.setSpText(12),
    },
    VideoMainFlexTextActiveAndce: {
        paddingTop: 10,
        color: '#D4D4D4',
        fontSize: Utils.setSpText(12),
    },
    VideoMainFlexTextActive: {
        paddingTop: 10,
        color: '#F6CF3D',
        fontSize: Utils.setSpText(12),
    },
    VideoBottomNav: {
        backgroundColor: '#fff',
        height: 50,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: Utils.size.width,
        borderTopColor: '#F2F2F2',
        borderTopWidth: 1,
    },
    VideoBottomNavLeft: {
        flex: 1,
        paddingLeft: 20,
        justifyContent: 'center',
    },
    VideoBottomNavLeftImg: {
        width: 20,
        height: 20,
    },
    VideoBottomNavLeftText: {
        paddingLeft: 15,
        color: '#6C6C6C',
        fontSize: Utils.setSpText(16),
    },
    VideoBottomNavRight: {
        backgroundColor: '#0089DD',
        paddingLeft: 20,
        paddingRight: 20,
        justifyContent: 'center',
    },
    VideoBottomNavRightText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: Utils.setSpText(18),
    },
    fullScreen: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    buttonContainer: {
        flex: 0,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    button: {
        padding: 5,
        margin: 5,
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 3,
        backgroundColor: 'grey',
    },
    slider: {
        marginLeft: 5,
        marginRight: 10,
        flex: 1,
        width: '100%',
        height: 10
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    playButton: {
        width: 50,
        height: 50,
    },
    playControl: {
        width: 24,
        height: 24,
        marginLeft: 15,
    },
    shrinkControl: {
        width: 15,
        height: 15,
        marginRight: 15,
    },
    time: {
        fontSize: 12,
        color: 'white',
        marginLeft: 10,
        marginRight: 10
    },
    control: {
        flexDirection: 'row',
        height: 44,
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        position: 'absolute',
        bottom: 0,
        left: 0
    },
    controlTop: {
        width: '100%',
        flexDirection: 'row',
        // height: (Utils.size.os === 'ios') ? 74 : 42,
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        position: 'absolute',
        // paddingTop: ( Utils.size.os === 'ios') ? 20 : 0,
        top: 0,
        left: 0,
        // zIndex: 100,
    },
    messageHeader: {
        height: (Utils.size.os === 'ios') ? 74 : 42,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: (Utils.size.os === 'ios') ? 30 : 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    messageHeaderTitle: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: Utils.setSpText(17),
    },
    messageHeaderBack: {
        width: 20,
        height: 20,
    },
    headerLeft: {
        paddingLeft: 10,
        width: 50,
    },
    headerRight: {
        width: 50,
        flexDirection: 'row-reverse',
    },
    modalStyle: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, .2)'
    },
    modalContent: {
        width: Utils.size.width,
        backgroundColor: '#fff',
    },
    modalHeader: {
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 15,
        paddingBottom: 15,
        borderBottomColor: '#E8E8EC',
        borderBottomWidth: 1,
        flexDirection: 'row',
        backgroundColor: '#F8F9F8',
    },
    modalHeaderLeft: {
        flex: 1,
        color: '#000',
        fontSize: Utils.setSpText(17),
    },
    modalHeaderRight: {
        color: '#57AEEE',
        fontSize: Utils.setSpText(17),
    },
    modalContentPadd: {
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 15,
        paddingBottom: 15,
        borderBottomColor: '#E8E8EC',
        borderBottomWidth: 1,
    },
    modalContentPrice: {
        paddingBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    modalContentPriceLeft: {
        flex: 1,
        color: '#909190',
        fontSize: Utils.setSpText(14),
    },
    modalContentPriceRight: {
        color: '#000',
        fontSize: Utils.setSpText(14),
    },
    modalContentTiShi: {
        color: '#DD9F00',
        paddingTop: 10,
        paddingBottom: 10,
        fontSize: Utils.setSpText(14),
    },
    modalButton: {
        marginTop: 15,
        marginBottom: 15,
        marginLeft: 15,
        marginRight: 15,
        backgroundColor: '#1378F6',
        height: 50,
        width: Utils.size.width - 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 3,
    },
    modalButtonBg: {
        marginTop: 15,
        marginBottom: 15,
        marginLeft: 15,
        marginRight: 15,
        backgroundColor: '#EE5744',
        height: 50,
        width: Utils.size.width - 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 3,
    },
    modalButtonText: {
        color: '#fff',
        fontSize: Utils.setSpText(18),
    },
    remarkInput: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 15,
    },
    remarkInputItems: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
    },
    remarkInputBorder: {
        borderBottomColor: '#E8E8EC',
        borderBottomWidth: 1,
    },
    remarkInputText: {
        color: '#000',
        fontSize: Utils.setSpText(16),
    },
    remarkInputTextDe: {
        padding: 10,
        color: '#909190',
        fontSize: Utils.setSpText(16),
    }
});
