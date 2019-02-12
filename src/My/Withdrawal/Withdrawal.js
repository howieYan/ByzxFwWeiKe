import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    Animated,
    AsyncStorage,
} from 'react-native';
import Utils from "../../Store/Utils";
import {Loading} from "../../Component/Loading";
export default class Withdrawal extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            data: {},
            type: 2
        }
    }
    componentDidMount () {
        this.LoadData();
    }
    async LoadData () {
        try {
            let Uid = await AsyncStorage.getItem('uId');
            let formData = new FormData();
            formData.append('uId', Uid);
            let data = await Utils.LoadPost(Utils.size.url + '/v1/account/getUserInfo', formData);
            console.log(data);
            if (Number(data.code) === 0) {
                this.setState({
                    data: data.result,
                })
            } else {
                Loading.Toast(data.message);
            }
        }
        catch (e) {
            console.log(e);
        }
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
                        <Text style={styles.PaymentOrderMoneyNumber}>¥{this.state.data.u_commission}</Text>
                    </View>
                    <View style={{width: Utils.size.width,height:5,}}/>
                    <View style={styles.PaymentOrderMain}>
                        <View style={styles.PaymentOrderTitle}>
                            <Text style={styles.PaymentOrderTitleText}>选择支付方式</Text>
                        </View>
                        <View style={styles.PaymentOrderWetch}>
                            <Image style={styles.PaymentOrderIcon} source={require('../../Image/PayFor.png')}/>
                            <View style={{flex: 1}}>
                                <Text style={styles.PaymentOrderIconWeact}>银行卡提现</Text>
                            </View>
                            <TouchableOpacity activeOpacity={0.8} onPress={this.OnPayType.bind(this, 1)}>
                                <Image style={styles.PaymentOrderXuan} source={this.state.type === 1 ? require('../../Image/Video/OptionsActive.png') : require('../../Image/Video/Options.png')}/>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.PaymentOrderWetch}>
                            <Image style={styles.PaymentOrderIcon} source={require('../../Image/Video/PayTreasure.png')}/>
                            <View style={{flex: 1}}>
                                <Text style={styles.PaymentOrderIconWeact}>支付宝提现</Text>
                            </View>
                            <TouchableOpacity activeOpacity={0.8} onPress={this.OnPayType.bind(this, 2)}>
                                <Image style={styles.PaymentOrderXuan} source={this.state.type === 2 ? require('../../Image/Video/OptionsActive.png') : require('../../Image/Video/Options.png')}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity activeOpacity={0.8} onPress={this.OnToPayFor.bind(this)}>
                        <View style={styles.PaymentOrderButton}>
                            <Text style={styles.PaymentOrderButtonText}>立即提现</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
    // 返回
    onBackButton () {
        this.props.navigation.state.params.BackLoad();
        this.props.navigation.goBack();
    }
    // 选择支付方式
    OnPayType (record) {
        this.setState({
            type: record
        })
    }
    // 立即提现
    OnToPayFor () {
        let _this = this;
        this.props.navigation.navigate(Number(this.state.type) === 1 ?  'BankCardWithdrawal' : 'AlipayWithdrawal', {name: Number(this.state.type) === 1 ? '银行卡提现' : '支付宝提现', data: this.state.data, BackLoad: function () {
                _this.LoadData();
            }})
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

