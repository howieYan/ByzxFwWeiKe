import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    Animated,
    AsyncStorage,
    Alert,
} from 'react-native';
import Utils from "../../Store/Utils";
import {Loading} from "../../Component/Loading";
import * as WeChat from "react-native-wechat";
import Alipay from 'react-native-yunpeng-alipay';
export default class PaymentOrder extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            data: {},
            payType: 1
        }
    }
    componentDidMount () {
        WeChat.registerApp('wx445a10ea5285fe46');
    }


    render() {
        return (
            <View style={styles.content}>
                <View style={styles.messageHeader}>
                    <TouchableOpacity activeOpacity={0.8}
                                      navigator={this.props.navigator}
                                      onPress={this.onBackButton.bind(this)}>
                        <View style={styles.headerLeft}>
                            <Image
                                style={styles.messageHeaderBack}
                                source={require('../../Image/Back.png')}
                            />
                        </View>
                    </TouchableOpacity>
                    <Animated.Text numberOfLines={1} style={[styles.messageHeaderTitle]}>{this.props.navigation.state.params.name}</Animated.Text>
                    <TouchableOpacity activeOpacity={0.8}>
                        <View style={styles.headerRight} >
                            <Text style={styles.headerRightText}>{}</Text>
                        </View>

                    </TouchableOpacity>
                </View>
                <View style={[styles.content, {backgroundColor: '#F6F6F6'}]}>
                    <View style={{width: Utils.size.width,height:10,backgroundColor: '#F6F6F6'}}/>
                    <View style={styles.PaymentOrderMoney}>
                        <View style={{flex: 1}}>
                            <Text style={styles.PaymentOrderMoneyText}>订单金额</Text>
                        </View>
                        <Text style={styles.PaymentOrderMoneyNumber}>¥{this.props.navigation.state.params.data.pg_price}</Text>
                    </View>
                    <View style={{width: Utils.size.width,height:5,}}/>
                    <View style={styles.PaymentOrderMain}>
                        <View style={styles.PaymentOrderTitle}>
                            <Text style={styles.PaymentOrderTitleText}>选择支付方式</Text>
                        </View>
                        <TouchableOpacity activeOpacity={0.8} onPress={this.OnPayType.bind(this, 1)}>
                            <View style={styles.PaymentOrderWetch}>
                                <Image style={styles.PaymentOrderIcon} source={require('../../Image/Video/Weact.png')}/>
                                <View style={{flex: 1}}>
                                    <Text style={styles.PaymentOrderIconWeact}>微信</Text>
                                </View>
                                <Image style={styles.PaymentOrderXuan} source={this.state.payType === 1 ? require('../../Image/Video/OptionsActive.png') : require('../../Image/Video/Options.png')}/>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.8} onPress={this.OnPayType.bind(this, 2)}>
                            <View style={styles.PaymentOrderWetch}>
                                <Image style={styles.PaymentOrderIcon} source={require('../../Image/Video/PayTreasure.png')}/>
                                <View style={{flex: 1}}>
                                    <Text style={styles.PaymentOrderIconWeact}>支付宝</Text>
                                </View>
                                <Image style={styles.PaymentOrderXuan} source={this.state.payType === 2 ? require('../../Image/Video/OptionsActive.png') : require('../../Image/Video/Options.png')}/>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity activeOpacity={0.8} onPress={this.OnToPayFor.bind(this)}>
                        <View style={styles.PaymentOrderButton}>
                            <Text style={styles.PaymentOrderButtonText}>去支付</Text>
                        </View>
                    </TouchableOpacity>
                </View>

            </View>
        );
    }
    // 返回
    onBackButton () {
        this.props.navigation.goBack()
    }
    // 选择支付方式
    OnPayType (record) {
        this.setState({
            payType: record
        })
    }
    // 去支付
    OnToPayFor () {
        this.LoadData()
    }
    // 下单
    async LoadData () {
        try {
            let Uid = await AsyncStorage.getItem('uId');
            let formData = new FormData();
            formData.append('pgId', this.props.navigation.state.params.pgId);
            formData.append('uId', Uid);
            formData.append('payType', this.state.payType);
            let data = await Utils.LoadPost(Utils.size.url + '/v1/course/addOrder', formData);
            console.log(data)
            if (Number(data.code) === 0) {
                if (Number(this.state.payType) === 1) {
                    this.LoadWechatPay(data.result);
                } else {
                    this.LoadAlipayPay(data.result);
                }

            } else {
                Loading.Toast(data.message);
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    // 微信支付
    async LoadWechatPay (record) {
        try {
            let formData = new FormData();
            formData.append('orderId', record.of_id);
            formData.append('uId', record.u_id);
            formData.append('payType', record.of_pay_type);
            let data = await Utils.LoadPost(Utils.size.url + '/v1/course/addPay', formData);
            console.log(data);
            if (Number(data.code) === 0) {
                let isWeixin = await  WeChat.isWXAppInstalled();
                let params = {
                    appid:  data.result.payment.appid,
                    partnerid: data.result.payment.mch_id,  // 商家向财付通申请的商家id
                    prepayid: data.result.payment.prepay_id,   // 预支付订单
                    noncestr: data.result.payment.nonce_str,   // 随机串，防重发
                    timestamp: data.result.payment.timestamp,  // 时间戳，防重发
                    package: data.result.payment.package,    // 商家根据财付通文档填写的数据和签名
                    sign: data.result.payment.signature        // 商家根据微信开放平台文档对数据做的签名
                };
                if (isWeixin) {
                    let results = await WeChat.pay(params);
                    if (Number(results.errCode) === 0){
                        Loading.Toast('支付成功');
                    } else {
                        Loading.Toast(data.name);
                    }
                } else {
                    Alert.alert('请安装微信');
                }

            } else {
                Loading.Toast(data.message);
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    //  支付宝支付
    async LoadAlipayPay (record) {
        console.log(record);
        try {
            let formData = new FormData();
            formData.append('orderId', record.of_id);
            formData.append('uId', record.u_id);
            formData.append('payType', record.of_pay_type);
            let data = await Utils.LoadPost(Utils.size.url + '/v1/course/addPay', formData);
            console.log(data)
            if (Number(data.code) === 0) {
                let payMent = data.result.payment;
                let payData = await Alipay.pay(payMent);
                console.log(payData)
                // let result = JSON.parse(payData[0].result);
                // if (Number(result.alipay_trade_app_pay_response.code) === 10000) {
                //     Loading.Toast('支付成功');
                // }
            } else {
                Loading.Toast(data.message);
            }
        }
        catch (e) {
            console.log(e);
        }
    }

}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        backgroundColor: '#fff',
    },
    messageHeader: {
        height: (Utils.size.os === 'ios') ? 74 : 42,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 10,
        paddingRight: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#EAEAEA',
        paddingTop: ( Utils.size.os === 'ios') ? 30 : 0,
        backgroundColor: '#fff',
    },
    headerRightText: {
        color: '#36b9c8',
        fontSize: Utils.setSpText(14),
    },
    swipoutLineBgColor: {
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
    // 内容:
    PaymentOrderMoney: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom:10,
        paddingTop:10,
        height: 50,
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#fff',
    },
    PaymentOrderMoneyText: {
        color: '#000000',
        fontSize: Utils.setSpText(17),
    },
    PaymentOrderMoneyNumber: {
        color: '#E00000',
        fontSize: Utils.setSpText(17),
    },
    PaymentOrderMain: {
        paddingRight: 10,
        paddingLeft: 10,
        backgroundColor: '#fff',
    },
    PaymentOrderTitle: {
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
        height: 40,
        justifyContent: 'center',
    },
    PaymentOrderTitleText: {
        color: '#3B3B3B',
        fontSize: Utils.setSpText(15),
    },
    PaymentOrderWetch:{
        paddingTop: 15,
        paddingBottom: 15,
        flexDirection: 'row',
        borderBottomWidth: 1,
        alignItems: 'center',
        borderBottomColor: '#EEEEEE',
    },
    PaymentOrderIcon: {
        width: 35,
        height: 35,
        borderRadius: 5,
    },
    PaymentOrderIconWeact: {
        paddingLeft: 10,
        color: '#000000',
        fontSize: Utils.setSpText(15),
    },
    PaymentOrderXuan: {
        width: 20,
        height: 20,
    },
    PaymentOrderButton: {
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: '#4189D5',
        width: Utils.size.width - 20,
        paddingTop: 15,
        paddingBottom: 15,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 3,
    },
    PaymentOrderButtonText: {
        fontSize: Utils.setSpText(17),
        color: '#fff',
    }
});

