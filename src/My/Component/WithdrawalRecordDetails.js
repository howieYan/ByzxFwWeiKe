import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    Animated,
} from 'react-native';
import Utils from "../../Store/Utils";
import {Loading} from "../../Component/Loading";

export default class WithdrawalRecord extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            page: 1,
            size: 1000,
            total: null,
            data: {},
        }
    }
    componentDidMount () {
        this.LoadData();
    }
    async LoadData () {
        try {
            let formData = new FormData();
            formData.append('uId', this.props.navigation.state.params.uId);
            formData.append('udKey', this.props.navigation.state.params.udKey);
            let data = await Utils.LoadPost(Utils.size.url + '/v1/account/commissionDetail', formData);
            if (Number(data.code) === 0) {
                this.setState({
                    data: data.result
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
                <View style={[styles.content]}>
                    <View style={styles.MainPadd}>
                        <View style={styles.MainBorder}>
                            <View style={styles.MainList}>
                                <View style={{flex: 1}}>
                                    <Text style={styles.MainListTitle}>提现金额</Text>
                                </View>
                                <Text style={styles.MainListTitle}>¥{this.state.data.ud_amount}</Text>

                            </View>
                            <View style={styles.MainList}>
                                <View style={{flex: 1}}>
                                    <Text style={styles.MainListTitle}>提现方式</Text>
                                </View>
                                <Text style={styles.MainListTitle}>{Number(this.state.data.ud_type) === 1 ? ' 支付宝' : '银行卡'}</Text>
                            </View>
                        </View>
                        <View style={styles.MainList}>
                            <View style={{flex: 1}}>
                                <Text style={styles.MainListTitle}>提现状态</Text>
                            </View>
                            <Text style={[styles.MainListTitle, styles.MainListTitleStatus]}>{Number(this.state.data.ud_status) === 1 ? '申请成功' : Number(this.state.data.ud_status) === 1 ? '提现成功' : '提现失败'}</Text>
                        </View>
                        {
                            Number(this.state.data.ud_status) === 3 ?
                                <View style={styles.MainText}>
                                    <View style={{width: 120}}>
                                        <Text style={[styles.MainListTitle, styles.MainListTitleStatus]}>失败原因:</Text>
                                    </View>
                                    <View style={{flex: 1}}>
                                        <Text style={[styles.MainListTitle, styles.MainListTitleStatus]}>
                                            申请成功提现失败
                                            申请成功提现失败
                                            申请成功提现失败
                                            申请成功提现失败
                                            申请成功提现失败
                                            申请成功提现失败
                                        </Text>
                                    </View>
                                </View>
                                : null
                        }

                    </View>
                    <View style={{flex: 1, justifyContent: 'flex-end', paddingLeft: 10,paddingRight:10,paddingBottom: 50,}}>
                        <TouchableOpacity activeOpacity={0.8} onPress={this.onBackButton.bind(this)}>
                            <View style={{backgroundColor: '#4089D3', height: 45, justifyContent: 'center', alignItems: 'center', borderRadius: 5}}>
                                <Text style={{color: '#fff', fontSize: Utils.setSpText(16)}}>知道了</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

            </View>
        );
    }
    // 返回
    onBackButton () {
        this.props.navigation.goBack();
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
    // 内容
    MainPadd: {
        paddingLeft: 10,
        paddingRight: 10,
    },
    MainBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#EAEAEA',
    },
    MainList: {
        paddingTop: 20,
        paddingBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },

    MainListTitle: {
        lineHeight: 24,
        color: '#000',
        fontSize: Utils.setSpText(18),
    },
    MainListBottom: {
        paddingTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    MainListBottomTime: {
        color: '#7D7D7D',
        fontSize: Utils.setSpText(13),
    },
    MainListBottomDa: {
        color: '#7D7D7D',
        fontSize: Utils.setSpText(13),
    },
    MainListTitleStatus: {
        color: '#CB0000',
    },
    MainText: {
        paddingTop: 20,
        paddingBottom: 20,
        flexDirection: 'row'
    }
});

