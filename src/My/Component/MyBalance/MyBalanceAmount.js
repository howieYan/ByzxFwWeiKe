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
    NativeModules,
    ScrollView,
    Alert, AsyncStorage
} from 'react-native';
import Utils from "../../../Store/Utils";
import {Loading} from "../../../Component/Loading";

const {InAppUtils} = NativeModules
export default class MyBalanceAmount extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }


    componentDidMount() {
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
                                source={require('../../../Image/Back.png')}
                            />
                        </View>
                    </TouchableOpacity>
                    <Animated.Text numberOfLines={1}
                                   style={[styles.messageHeaderTitle]}>{this.props.navigation.state.params.name}</Animated.Text>
                    <TouchableOpacity activeOpacity={0.8}>
                        <View style={styles.headerRight}>
                            <Text style={styles.headerRightText}>{}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={[styles.content, styles.padding]}>
                    <ScrollView>
                        {this.listView()}
                    </ScrollView>
                </View>
            </View>
        );
    }

    // 返回
    onBackButton() {
        this.props.navigation.state.params.ReceiveCode();
        this.props.navigation.goBack();
    }

    listView() {
        let List = [];
        let {data} = this.props.navigation.state.params;
        data.forEach((v, i) => {
            List.push(
                <View style={styles.ListViewCell} key={i}>
                    <Text style={styles.ListViewCellLeft}>{v.price}币</Text>
                    <TouchableOpacity activeOpacity={0.8} onPress={this.onAlert.bind(this, v)}>
                        <View style={styles.ListViewCellButton}>
                            <Text style={styles.ListViewCellButtonText}>{v.priceString}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            )
        })
        return List;
    }

    onAlert(record) {
        Alert.alert(
            '提示',
            '请保持网路畅通，如您的苹果账号未绑定支付宝，微信或银行卡请暂停购买，先去App Store绑定后再来购买！',
            [
                {text: '取消', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: '继续', onPress: () => this.onTopUp(record)},
            ],
            {cancelable: false}
        )
    }

    // 立即充值
    onTopUp(record) {
        Loading.show('支付中,请勿关闭App....')
        // 检查是否允许付款
        InAppUtils.canMakePayments((canMakePayments) => {
            if (!canMakePayments) {
                alert('此设备不允许购买。 请检查设备的限制');
            } else {
                // 购买产品
                var productIdentifier = record.identifier;
                InAppUtils.purchaseProduct(productIdentifier, (error, response) => {
                    Loading.hidden();
                    if (response.productIdentifier) {
                        console.log(response)
                        this.onAppStoreReceipt(response)
                    }
                });
            }
        })
    }

    async onAppStoreReceipt(record) {
        try {
            let Uid = await AsyncStorage.getItem('uId');
            let formData = new FormData();
            formData.append('uId', Uid);
            formData.append('receiptData', JSON.stringify(record));
            formData.append('sandbox', 0);
            console.log(formData);
            let data = await Utils.LoadPost(Utils.size.url + '/v1/account/appStoreReceipt', formData);
            console.log(data);
            if (Number(data.code) === 0) {
                Loading.hidden();
                Loading.Toast('充值成功');
            } else {
                Loading.Toast(data.message);
            }
        } catch (e) {
            console.log(e);
        }
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
    padding: {
        backgroundColor: '#fff',
        paddingLeft: 15,
        paddingRight: 15,
    },
    ListViewCell: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#EAEAEA',
    },
    ListViewCellLeft: {
        flex: 1,
        color: '#000',
        fontSize: Utils.setSpText(16),
    },
    ListViewCellButton: {
        backgroundColor: '#318DD6',
        width: 80,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 3,
    },
    ListViewCellButtonText: {
        color: '#fff',
        fontSize: Utils.setSpText(14),
    }
})

