/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    Animated,
    NativeModules, AsyncStorage
} from 'react-native';
import Utils from "../../../Store/Utils";
import {Loading} from "../../../Component/Loading";

const {InAppUtils} = NativeModules
export default class MyBalance extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: {}
        }
    }


    componentDidMount() {
        this.LoadData();
    }

    async LoadData() {
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
        } catch (e) {
            console.log(e)
        }
    }
    render() {
        let {data} = this.state
        return (
            <View style={styles.content}>
                <View style={styles.messageHeader}>
                    <TouchableOpacity activeOpacity={0.8}
                                      navigator={this.props.navigator}
                                      onPress={this.onBackButton.bind(this)}>
                        <View style={styles.headerLeft}>
                            <Image
                                style={styles.messageHeaderBack}
                                source={require('../../../Image/Back.png')}
                            />
                        </View>
                    </TouchableOpacity>
                    <Animated.Text numberOfLines={1}
                                   style={[styles.messageHeaderTitle]}>{this.props.navigation.state.params.name}</Animated.Text>
                    <TouchableOpacity activeOpacity={0.8} onPress={this.onTheDetail.bind(this)}>
                        <View style={styles.headerRight}>
                            <Text style={styles.headerRightText}>明细</Text>
                        </View>

                    </TouchableOpacity>
                </View>
                <View style={[styles.content, styles.contentBg,]}>
                    <View style={styles.moeny}>
                        <Text style={styles.moenyText}>总金额</Text>
                    </View>
                    <View style={styles.moenyNumber}>
                        <Text style={styles.moenyNumberText}>{data.u_balance}</Text>
                    </View>
                    <View style={styles.button}>
                        <TouchableOpacity activeOpacity={0.8} onPress={this.onTopUp.bind(this)}>
                            <View style={styles.buttonSize}>
                                <Text style={styles.buttonSizeText}>立即充值</Text>
                            </View>

                        </TouchableOpacity>

                        <Text style={styles.textTitle}>说明</Text>
                        <View style={styles.textView}>
                            <Text style={styles.text}>1.充值金额只能在泛网微课ios
                                App内使用，不能用于泛网微课安卓、WEB网站等其他平台、不支持发票申请！</Text>
                            <Text style={styles.text}>2.充值金额无限期使用。</Text>
                            <Text style={styles.text}>3.如遇到无法充值、充值失败等情况，请提交意见反馈或查看官网常见问题。</Text>
                            <Text
                                style={styles.text}>4.请在网络条件较好的情况下进行充值，并耐心等待充值结果，不要进行其他无关操作。</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    // 返回
    onBackButton() {
        this.props.navigation.goBack();
    }

    // 明细
    onTheDetail() {
        this.props.navigation.navigate('BalanceDetails', {
                name: '明细',
                data: this.state.data,
            })
    }

    // 立即充值
    onTopUp() {
        Loading.show('努力加载中....')
        const identifiers = [
            'com.fwweike.68',
            'com.fwweike.98',
            'com.fwweike.108',
            'com.fwweike.168',
            'com.fwweike.208',
        ];
        // 加载产品
        InAppUtils.loadProducts(identifiers, (error, products) => {
            if (products.length !== 0) {
                Loading.hidden();
                this.props.navigation.navigate('MyBalanceAmount', {name: '充值', data: products,ReceiveCode:  () => {
                        this.LoadData()
                    }})
            } else {
                Loading.Toast('加载失败，请重新加载')
            }
        });
    }
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
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
        paddingTop: (Utils.size.os === 'ios') ? 30 : 0,
        backgroundColor: '#fff',
    },
    headerRightText: {
        color: '#36b9c8',
        fontSize: Utils.setSpText(14),
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
        flexDirection: 'row-reverse',
    },
    moeny: {
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    contentBg: {
        backgroundColor: '#fff'
    },
    moenyText: {
        fontSize: Utils.setSpText(16),
        color: '#000',
    },
    moenyNumber: {
        height: 70,
        alignItems: 'center',
        justifyContent: 'center',
    },
    moenyNumberText: {
        fontSize: Utils.setSpText(30),
        color: '#000',
    },
    button: {
        paddingTop: 40,
        paddingLeft: 20,
        paddingRight: 20,
    },
    buttonSize: {
        backgroundColor: '#318DD6',
        borderRadius: 2,
        width: Utils.size.width - 40,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonSizeText: {
        color: '#fff',
        fontSize: Utils.setSpText(17)
    },
    textTitle: {
        paddingTop: 30,
        paddingBottom: 10,
        color: '#333',
        fontSize: Utils.setSpText(16),
    },
    text: {
        color: '#666',
        lineHeight: 25,
        fontSize: Utils.setSpText(14),
    }
})

