import React, {Component} from 'react'
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    AsyncStorage,
    Linking
} from 'react-native'
import Utils from '../Store/Utils';
import {Loading} from "../Component/Loading";
import * as WeChat from 'react-native-wechat';
import {SwRefreshScrollView} from "react-native-swRefresh";
import AlertView from "../Component/Alert";
import DeviceInfo from "react-native-device-info";

export default class My extends Component {
    constructor(props) {
        super(props);
        this.translateY = 150;
        this.state = {
            Uid: null,
            data: {},
            dataNull: false,
            uri: '',
            refreshing: false,
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
        }
    }

    componentDidMount() {
        this.LoadData();
    }

    async LoadData() {
        try {
            let Uid = await AsyncStorage.getItem('uId');
            if (Uid) {
                this.setState({
                    Uid: Uid
                })
                this.LoadDataUser()
            } else {
                this.ToLogin()
                this.LoadDataUser()
            }
        } catch (e) {
            console.log(e);
        }
    }

    async LoadDataUser() {
        try {
            let formData = new FormData();
            formData.append('uId', this.state.Uid);
            let data = await Utils.LoadPost(Utils.size.url + '/v1/account/getUserInfo', formData);
            console.log(data);
            if (Number(data.code) === 0) {
                this.setState({
                    data: data.result,
                    refreshing: false
                })
            } else {
                Loading.Toast(data.message);
            }
        } catch (e) {
            console.log(e)
        }
    }

    ToLogin() {
        let _this = this;
        this.props.navigation.navigate('Login', {
            ReceiveCode: () => {
                _this.LoadData()
            }
        });
    }

    _onRefresh(end) {
        let _this = this;
        let timer = setTimeout(() => {
            clearTimeout(timer)
            _this.LoadData();
            end()//刷新成功后需要调用end结束刷新
        }, 500)
    }

    render() {
        return (
            <View style={styles.container}>
                {Utils.size.os === 'ios' ?
                    <View style={styles.header}>
                        <View style={styles.MyHeader}>
                            <SwRefreshScrollView
                                color={'#fff'}
                                onRefresh={this._onRefresh.bind(this)}
                                ref="scrollView">
                                <View style={styles.MyHeaderFFPa}>
                                    <View style={styles.MyHeaderFF}>
                                        <View style={styles.MyHeaderAtaver}>
                                            <TouchableOpacity activeOpacity={0.8}
                                                              onPress={this.onUserButton.bind(this)}>
                                                <Image style={styles.MyUserActaver}
                                                       source={this.state.Uid && this.state.data.u_avatar ? {uri: this.state.data.u_avatar} : require('../Image/My/UserActive.png')}/>
                                                <Image style={styles.MyUserEdit}
                                                       source={require('../Image/My/UserEdit.png')}/>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={styles.MyNav}>
                                            <Text
                                                style={styles.MyUserName}>{this.state.Uid ? this.state.data.u_nickname : '未登录'}</Text>
                                            <View style={styles.MyUserNav}>
                                                <TouchableOpacity activeOpacity={0.8}
                                                                  onPress={this.onWithdrawal.bind(this, this.state.data.u_commission)}>
                                                    <View style={styles.MyUserNavWithdraw}>
                                                        <Image style={styles.MyUserNavWithdrawImg}
                                                               source={require('../Image/My/Withdraw.png')}/>
                                                        <Text style={styles.MyUserNavWithdrawText}
                                                              numberOfLines={1}>可提现:¥{this.state.Uid ? this.state.data.u_commission : 0}</Text>
                                                    </View>
                                                </TouchableOpacity>
                                                <View style={styles.borderRight}/>
                                                <View style={styles.MyUserNavWithdraw}>
                                                    <Image style={styles.MyUserNavWithdrawImg}
                                                           source={require('../Image/My/Commission.png')}/>
                                                    <Text style={styles.MyUserNavWithdrawText}
                                                          numberOfLines={1}>佣金:¥{this.state.Uid ? this.state.data.u_commission_total : 0}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{
                                            width: Utils.size.width,
                                            height: 5,
                                            backgroundColor: '#F6F6F6',
                                        }}/>
                                        <View style={styles.MyCell}>
                                            {this.CellList()}
                                        </View>
                                    </View>
                                </View>
                            </SwRefreshScrollView>
                        </View>
                    </View>
                    :
                    <View style={styles.header}>
                        <View style={styles.MyHeader}>
                            <SwRefreshScrollView
                                onRefresh={this._onRefresh.bind(this)}
                                ref="scrollView">
                                {/*<ScrollView>*/}
                                <View style={styles.MyHeaderFFPa}>
                                    <View style={styles.container}>
                                        <View style={styles.MyHeaderAtaver}>
                                            <TouchableOpacity activeOpacity={0.8}
                                                              onPress={this.onUserButton.bind(this)}>
                                                <Image style={styles.MyUserActaver}
                                                       source={this.state.Uid && this.state.data.u_avatar ? {uri: this.state.data.u_avatar} : require('../Image/My/UserActive.png')}/>
                                                <Image style={styles.MyUserEdit}
                                                       source={require('../Image/My/UserEdit.png')}/>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={styles.MyHeaderFF}>
                                            <View style={styles.MyNav}>
                                                <Text
                                                    style={styles.MyUserName}>{this.state.Uid ? this.state.data.u_nickname : '未登录'}</Text>
                                                <View style={styles.MyUserNav}>
                                                    <TouchableOpacity activeOpacity={0.8}
                                                                      onPress={this.onWithdrawal.bind(this, this.state.data.u_commission)}>
                                                        <View style={styles.MyUserNavWithdraw}>
                                                            <Image
                                                                style={styles.MyUserNavWithdrawImg}
                                                                source={require('../Image/My/Withdraw.png')}/>
                                                            <Text
                                                                style={styles.MyUserNavWithdrawText}
                                                                numberOfLines={1}>可提现:¥{this.state.Uid ? this.state.data.u_commission : 0}</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                    <View style={styles.borderRight}/>
                                                    <View style={styles.MyUserNavWithdraw}>
                                                        <Image style={styles.MyUserNavWithdrawImg}
                                                               source={require('../Image/My/Commission.png')}/>
                                                        <Text style={styles.MyUserNavWithdrawText}
                                                              numberOfLines={1}>佣金:¥{this.state.Uid ? this.state.data.u_commission_total : 0}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={{
                                                width: Utils.size.width,
                                                height: 5,
                                                backgroundColor: '#F6F6F6',
                                            }}/>
                                            <View
                                                style={[styles.container, {height: Utils.size.height}]}>
                                                <View style={styles.MyCell}>

                                                    {this.CellList()}
                                                    {
                                                        Utils.size.os === 'ios' ? null
                                                            :
                                                            <TouchableOpacity activeOpacity={0.8}
                                                                              onPress={this.onVervison.bind(this)}>
                                                                <View style={styles.MyCellRow}>
                                                                    <Image style={styles.MyCellIcon}
                                                                           source={require('../Image/My/vervison.png')}/>
                                                                    <View style={{flex: 1,}}>
                                                                        <Text
                                                                            style={styles.MyCellText}>检测新版</Text>
                                                                    </View>
                                                                    <Image
                                                                        style={styles.MyCellIconRight}
                                                                        source={require('../Image/My/CellRight.png')}/>
                                                                </View>
                                                            </TouchableOpacity>
                                                    }
                                                    {/*{*/}
                                                    {/*Utils.size.os === 'ios' ?*/}
                                                    {/*<TouchableOpacity activeOpacity={0.8}*/}
                                                    {/*onPress={this.onMyBalance.bind(this)}>*/}
                                                    {/*<View style={styles.MyCellRow}>*/}
                                                    {/*<Image style={styles.MyCellIcon}*/}
                                                    {/*source={require('../Image/My/myBalance.png')}/>*/}
                                                    {/*<View style={{flex: 1,}}>*/}
                                                    {/*<Text*/}
                                                    {/*style={styles.MyCellText}>我的余额</Text>*/}
                                                    {/*</View>*/}
                                                    {/*<Image*/}
                                                    {/*style={styles.MyCellIconRight}*/}
                                                    {/*source={require('../Image/My/CellRight.png')}/>*/}
                                                    {/*</View>*/}
                                                    {/*</TouchableOpacity>*/}
                                                    {/*: null*/}
                                                    {/*}*/}
                                                    <Text>22222222222222222</Text>
                                                </View>
                                            </View>

                                        </View>
                                    </View>
                                </View>
                                {/*</ScrollView>*/}
                            </SwRefreshScrollView>
                        </View>
                    </View>
                }
                {this._renderAndroidAlert()}
            </View>
        )
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

    //  list cell
    CellList() {
        let list = [];
        let array = [
            {
                icon: require('../Image/My/myBalance.png'),
                name: '我的余额',
                component: 'MyBalance',
                isOn: true,
                os: 'ios'
            },
            {
                icon: require('../Image/My/MyVip.png'),
                name: '我的会员',
                component: 'MyVip',
                isOn: true,
                os: '0'
            },
            {
                icon: require('../Image/My/order.png'),
                name: '我的订单',
                component: 'MyOrder',
                isOn: true,
                os: '0'
            },
            {
                icon: require('../Image/My/collect.png'),
                name: '我的收藏',
                component: 'UserCollect',
                isOn: true,
                os: '0'
            },
            {
                icon: require('../Image/My/share.png'),
                name: '分享赚佣金',
                component: '',
                isOn: false,
                onClick: 1,
                os: '0'
            },
            {
                icon: require('../Image/My/record.png'),
                name: '提现记录',
                component: 'WithdrawalRecord',
                isOn: true,
                os: '0'
            },
            {
                icon: require('../Image/My/setting.png'),
                name: '设置账号',
                component: 'Setting',
                isOn: true,
                os: '0'
            },
            {
                icon: require('../Image/My/quiz.png'),
                name: '我的提问',
                component: 'UserQuiz',
                isOn: true,
                os: '0'
            },
            {
                icon: require('../Image/My/help.png'),
                name: '帮助与反馈',
                component: 'HelpFeedback',
                isOn: true,
                os: '0'
            },
            {
                icon: require('../Image/My/vervison.png'),
                name: '检测新版',
                component: '',
                isOn: true,
                os: 'android'
            },
        ];
        array.forEach((v, i) => {
            if (v.os === '0') {
                list.push(
                    <TouchableOpacity activeOpacity={0.8} key={i}
                                      onPress={this.onCellButton.bind(this, v)}>
                        <View style={styles.MyCellRow}>
                            <Image style={styles.MyCellIcon} source={v.icon}/>
                            <View style={{flex: 1,}}>
                                <Text style={styles.MyCellText}>{v.name}</Text>
                            </View>
                            <Image style={styles.MyCellIconRight}
                                   source={require('../Image/My/CellRight.png')}/>
                        </View>
                    </TouchableOpacity>
                )
            } else if (v.os === Utils.size.os) {
                list.push(
                    <TouchableOpacity activeOpacity={0.8} key={i}
                                      onPress={this.onCellButton.bind(this, v)}>
                        <View style={styles.MyCellRow}>
                            <Image style={styles.MyCellIcon} source={v.icon}/>
                            <View style={{flex: 1,}}>
                                <Text style={styles.MyCellText}>{v.name}</Text>
                            </View>
                            <Image style={styles.MyCellIconRight}
                                   source={require('../Image/My/CellRight.png')}/>
                        </View>
                    </TouchableOpacity>
                )
            } else if (v.os === Utils.size.os) {
                list.push(
                    <TouchableOpacity activeOpacity={0.8} key={i}
                                      onPress={this.onCellButton.bind(this, v)}>
                        <View style={styles.MyCellRow}>
                            <Image style={styles.MyCellIcon} source={v.icon}/>
                            <View style={{flex: 1,}}>
                                <Text style={styles.MyCellText}>{v.name}</Text>
                            </View>
                            <Image style={styles.MyCellIconRight}
                                   source={require('../Image/My/CellRight.png')}/>
                        </View>
                    </TouchableOpacity>
                )
            }

        });
        return list;
    }
    // 个人信息
    onUserButton() {
        let _this = this;
        this.props.navigation.navigate('UserDetails', {
            name: '个人信息', data: this.state.data, ReceiveCode: function () {
                _this.LoadData();
            }
        })
    }

    //  某个list cell详情
    onCellButton(record) {
        if (this.state.Uid) {
            if (record.isOn) {
                if (record.component) {
                    let _this = this;
                    this.props.navigation.navigate(record.component, {
                        name: record.name, data: this.state.data, ReceiveCode: function () {
                            _this.LoadData();
                        }
                    })
                } else {
                    this.onVervison()
                }

            } else {
                if (record.onClick === 1) {
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
            }
        } else {
            this.alertEvent();
        }
    }

    // 检测新版
    async onVervison() {
        try {
            let data = await Utils.LoadPost(Utils.size.url + '/v1/settings/upgraded')
            console.log(data);
            if (Number(data.result.d_version) > Number(DeviceInfo.getVersion())) {
                this.setState({
                    alertData: {
                        leftName: '确定',
                        rightName: '取消',
                        alertTitle: '提示',
                        alertContent: '有最新的版本是否要下载？',
                        leftClick: this.onVervisonOk.bind(this, data.result.d_path),
                        rightClick: this.rightClick.bind(this),
                    }
                })
                this.refs.alert && this.refs.alert.showDialog();
            } else {
                this.setState({
                    alertData: {
                        leftName: '确定',
                        rightName: '取消',
                        alertTitle: '提示',
                        alertContent: '亲 对不起暂时没有更新包',
                        leftClick: this.rightClick.bind(this,),
                        rightClick: this.rightClick.bind(this),
                    }
                })
            }
        } catch (e) {
            console.log(e);
        }
    }

    // 检测新版接口
    onVervisonOk(record) {
        Linking.canOpenURL(record)
            .then(supported => {
                if (!supported) {
                    console.log('Can\'t handle url: ' + record);
                } else {
                    return Linking.openURL(record)
                }
            }).catch(err => console.error('An error occurred', err));
    }

    //  弹窗
    alertEvent() {
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

    // 取消弹窗
    rightClick = () => {
        this.refs.alert && this.refs.alert.hideAlertView();
    }

    // 微信好友
    async onWechat() {
        try {
            WeChat.registerApp('wx445a10ea5285fe46');
            let avatar = this.state.data.u_avatar ? this.state.data.u_avatar : 'https://bywk.qcdqnet.com/uploads/image/201810/432986439193205370.jpg'
            let data = await WeChat.isWXAppInstalled();
            if (data) {
                let Share = await WeChat.shareToSession(
                    {
                        title: '泛网微课',
                        description: '一起学习，一起赚佣金',
                        thumbImage: avatar,
                        type: 'news',
                        webpageUrl: Utils.size.url + 'share/download/' + this.state.data.u_id
                    }
                )
                if (Number(Share.errCode) === 0) {
                    Loading.Toast('分享成功')
                } else {
                    Loading.Toast('分享失败')
                }
            } else {
                Loading.Toast('没有安装微信软件，请您安装微信之后再试');
            }

        } catch (e) {
            console.log(e);
        }
    }

    // 朋友圈
    async onFriends() {
        try {
            WeChat.registerApp('wx445a10ea5285fe46');
            let data = await WeChat.isWXAppInstalled();
            if (data) {
                let Share = await WeChat.shareToTimeline(
                    {
                        title: '泛网微课',
                        description: '一起学习，一起赚佣金',
                        thumbImage: this.state.data.u_avatar,
                        type: 'news',
                        webpageUrl: Utils.size.url + 'share/download/' + this.state.data.u_id
                    }
                )
                if (Number(Share.errCode) === 0) {
                    Loading.Toast('分享成功')
                } else {
                    Loading.Toast('分享失败')
                }
            } else {
                Loading.Toast('没有安装微信软件，请您安装微信之后再试');
            }
        } catch (e) {
            console.log(e);
        }
    }

    // 提现
    onWithdrawal(record) {
        if (Number(record) > 0) {
            let _this = this;
            this.props.navigation.navigate('Withdrawal', {
                name: '我要提现', data: this.state.data, BackLoad: function () {
                    _this.LoadData();
                }
            })
        } else {
            this.setState({
                alertData: {
                    rightName: '知道了',
                    alertTitle: '提示',
                    alertContent: '您账户余额不足',
                    leftClick: this.ToLogin.bind(this),
                    rightClick: this.rightClick.bind(this),
                }
            })
            this.refs.alert && this.refs.alert.showDialog();
        }
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flex: 1,
        backgroundColor: '#4089D5',
    },
    MyHeader: {
        flex: 1,
        marginTop: Utils.size.os === 'ios' ? 80 : 50,
        width: Utils.size.width,
        height: Utils.size.height
    },
    MyHeaderFF: {
        flex: 1,
        borderTopRightRadius: 25,
        borderTopLeftRadius: 25,
        backgroundColor: '#fff',
        width: Utils.size.width,
        height: Utils.size.height,
        // position: 'absolute',
        // top: 30,
        // zIndex: 99,
    },
    MyHeaderFFPa: {
        flex: 1,
        paddingTop: 30,
        width: Utils.size.width,
        height: Utils.size.height,
    },
    MyHeaderAtaver: {
        position: 'absolute',
        top: -30,
        zIndex: 100,
        elevation: 100,
        width: Utils.size.width,
        justifyContent: 'center',
        alignItems: 'center',
    },
    Activer: {
        position: 'absolute',
        top: Utils.size.os === 'ios' ? 50 : 30,
        width: Utils.size.width,
        justifyContent: 'center',
        alignItems: 'center',
    },
    MyNav: {
        paddingTop: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    MyUserActaver: {
        borderColor: '#f6f6f6',
        borderWidth: 2,
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    MyUserEdit: {
        position: 'absolute',
        top: 42,
        left: 45,
        width: 15,
        height: 15,
    },
    MyUserName: {
        paddingTop: 10,
        backgroundColor: 'transparent',
        fontSize: Utils.setSpText(12),
        color: '#000'
    },
    MyUserNav: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        paddingTop: 15,
        paddingBottom: 15,
    },
    MyUserNavWithdraw: {
        width: Utils.size.width / 2 - 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    MyUserNavWithdrawImg: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    MyUserNavWithdrawText: {
        paddingTop: 5,
        color: '#000',
        fontSize: Utils.setSpText(14),
    },
    borderRight: {
        borderRightWidth: 1,
        marginTop: 15,
        height: 30,
        marginLeft: 10,
        marginRight: 10,
        borderRightColor: '#e5e5e5'
    },
    MyCell: {
        flex: 1,
        paddingRight: 10,
        paddingLeft: 10,
    },
    MyCellRow: {
        alignItems: 'center',
        flexDirection: 'row',
        paddingTop: 15,
        paddingBottom: 15,
        borderBottomWidth: 1,
        justifyContent: 'center',
        borderBottomColor: '#F1F1F1',
    },
    MyCellIcon: {
        width: 22,
        height: 22,
    },
    MyCellText: {
        color: '#000000',
        paddingLeft: 10,
        fontSize: Utils.setSpText(16),
    },
    MyCellIconRight: {
        width: 14,
        height: 14,
    },
});
