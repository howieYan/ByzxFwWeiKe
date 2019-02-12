import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    Animated, AsyncStorage, TextInput,
} from 'react-native';
import Utils from "../../Store/Utils";
import {Loading} from "../../Component/Loading";
export default class BankCardWithdrawal extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            type: 2,
            bankName: '请选择银行卡',
            amount: '',
            username: '',
            bankcard: '',
            mobile: '',
        }
    }
    componentDidMount () {
        this.setState({
            amount: this.props.navigation.state.params.data.u_commission
        })
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
                    <View style={styles.PaymentOrderMain}>
                        <View style={styles.PaymentOrderWetch}>
                            <View style={{width: 120,}}>
                                <Text style={styles.PaymentOrderIconWeact}>提现金额</Text>
                            </View>
                            <View style={{flex: 1}}>
                                <TextInput
                                    style={styles.textInputs}
                                    onChangeText={(text) =>this.setState({amount: text})}
                                    value={this.state.amount}
                                    underlineColorAndroid='transparent'
                                    placeholder={this.state.amount + '元'}
                                />
                            </View>
                        </View>
                        <View style={styles.PaymentOrderWetch}>
                            <View style={{width: 120,}}>
                                <Text style={styles.PaymentOrderIconWeact}>持卡人</Text>
                            </View>
                            <View style={{flex: 1}}>
                                <TextInput
                                    style={styles.textInputs}
                                    underlineColorAndroid='transparent'
                                    onChangeText={(text) =>this.setState({username: text})}
                                    value={this.state.username}
                                    placeholder={'张某某'}
                                />
                            </View>
                        </View>
                        <View style={styles.PaymentOrderWetch}>
                            <View style={{width: 120,}}>
                                <Text style={styles.PaymentOrderIconWeact}>预留手机号</Text>
                            </View>
                            <View style={{flex: 1}}>
                                <TextInput
                                    style={styles.textInputs}
                                    maxLength={11}
                                    underlineColorAndroid='transparent'
                                    onChangeText={(text) =>this.setState({mobile: text})}
                                    value={this.state.mobile}
                                    placeholder={'135********'}
                                />
                            </View>
                        </View>
                        <View style={styles.PaymentOrderWetch}>
                            <View style={{width: 120,}}>
                                <Text style={styles.PaymentOrderIconWeact}>卡号</Text>
                            </View>
                            <View style={{flex: 1}}>
                                <TextInput
                                    style={styles.textInputs}
                                    underlineColorAndroid='transparent'
                                    onChangeText={(text) =>this.setState({bankcard: text})}
                                    value={this.state.bankcard}
                                    placeholder={'6217853600002893070'}
                                />
                            </View>
                        </View>
                        <View style={styles.PaymentOrderWetch}>
                            <View style={{width: 120,}}>
                                <Text style={styles.PaymentOrderIconWeact}>支行名称</Text>
                            </View>
                            <View style={{flex: 1}}>
                                <TextInput
                                    style={styles.textInputs}
                                    underlineColorAndroid='transparent'
                                    onChangeText={(text) =>this.setState({bankBranch: text})}
                                    value={this.state.bankBranch}
                                    placeholder={'某某支行'}
                                />
                            </View>
                        </View>
                        <View style={styles.PaymentOrderWetch}>
                            <View style={{flex: 1}}>
                                <Text style={styles.PaymentOrderIconWeact}>银行</Text>
                                <Text style={styles.PaymentOrderIconWeactText}> 收取0.1%手续费</Text>
                            </View>
                            <TouchableOpacity activeOpacity={0.8} onPress={this.OnSelectBank.bind(this)}>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={styles.PaymentOrderText}>{this.state.bankName}</Text>
                                    <Image style={styles.MyCellIconRight} source={require('../../Image/My/CellRight.png')}/>
                                </View>
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
    // 选择银行卡
    OnSelectBank () {
        let _this = this;
        this.props.navigation.navigate('SelectBank', {name: '选择开户银行', ReceiveCode: function (record) {
                _this.setState({
                    bankName: record
                })
            }})
    }
    // 去支付
    OnToPayFor () {
        if (!this.state.amount) {
            Loading.Toast('金额不能为空')
        } else if (this.state.amount > this.props.navigation.state.params.data.u_commission) {
            Loading.Toast('您的金额不足')
        } else if (!this.state.username) {
            Loading.Toast('持卡人不能为空')
        } else if (!this.state.mobile) {
            Loading.Toast('银行预留手机号码不能为空')
        } else if (!this.state.bankcard) {
            Loading.Toast('卡号不能为空')
        } else if (!this.state.bankBranch) {
            Loading.Toast('支行名称不能为空')
        } else if (this.state.bankName === '请选择银行卡') {
            Loading.Toast('银行名称不能为空')
        } else {
            this.LoadData();
        }
    }
    async LoadData () {
        try {
            let Uid = await AsyncStorage.getItem('uId');
            let formData = new FormData();
            formData.append('amount', this.state.amount);
            formData.append('type', this.state.type);
            formData.append('alipay', this.state.alipay);
            formData.append('bankName', this.state.bankName);
            formData.append('bankcard', this.state.bankcard);
            formData.append('username', this.state.username);
            formData.append('mobile', this.state.mobile);
            formData.append('bankBranch', this.state.bankBranch);
            formData.append('uId', Uid);
            let data = await Utils.LoadPost(Utils.size.url + '/v1/account/setCommission', formData);
            if (Number(data.code) === 0) {
                Loading.Toast('提现成功');
                setTimeout(() => {
                    this.onBackButton();
                }, 1000)
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
        paddingTop: 20,
        paddingBottom: 20,
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
        fontSize: Utils.setSpText(17),
    },
    PaymentOrderXuan: {
        width: 20,
        height: 20,
    },
    PaymentOrderButton: {
        marginTop: 30,
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
    },
    PaymentOrderText: {
        color: '#A9A9A9',
        fontSize: Utils.setSpText(16),
    },
    PaymentOrderIconWeactText: {
        color: '#B2B2B2',
        fontSize: Utils.setSpText(13),
    },
    MyCellIconRight: {
        width: 14,
        height: 14,
    },
});

