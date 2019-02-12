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
import {SwRefreshScrollView} from "react-native-swRefresh";
import {Loading} from "../../Component/Loading";

export default class WithdrawalRecord extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            page: 1,
            size: 1000,
            total: null,
            list: [],
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
            formData.append('page', this.state.page);
            formData.append('size', this.state.size);
            let data = await Utils.LoadPost(Utils.size.url + '/v1/account/getCommission', formData);
            if (Number(data.code) === 0) {
                this.setState({
                    total: data.result.total,
                    list: data.result.list,
                })
            } else {
                Loading.Toast(data.message);
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    _onRefresh(end){
        let _this = this;
        let timer =  setTimeout(()=>{
            clearTimeout(timer)
            _this.LoadData();
            end()//刷新成功后需要调用end结束刷新
        },500)
        // this.refs.scrollView.scrollTo({x: 0, y: 0, animated: false})
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
                    <SwRefreshScrollView
                        onRefresh={this._onRefresh.bind(this)}
                        ref="scrollView"
                        total = {this.state.total}
                        //其他你需要设定的属性(包括ScrollView的属性)
                    >
                        <View style={{flex: 1}}>
                            {this.renderList()}
                        </View>
                    </SwRefreshScrollView>
                </View>

            </View>
        );
    }
    renderList () {
        let List = [];
        if (Number(this.state.total) > 0) {
            this.state.list.forEach((v, i) => {
                List.push(
                    <TouchableOpacity key={i} activeOpacity={0.8} onPress={this.OnDetails.bind(this, v)}>
                        <View style={styles.mainList}>
                            <View style={styles.mainListHeader}>
                                <View style={{flex: 1}}>
                                    <Text style={styles.mainListHeaderTime}>{v.ud_updated}</Text>
                                </View>
                                <Text style={styles.mainListHeaderRight}>{Number(v.ud_status) === 1 ? '申请成功' : Number(v.ud_status) === 2 ? '提现成功' : '提现失败' }</Text>
                            </View>
                            <View style={styles.mainCenter}>
                                <Image style={styles.mainCenterImg} source={Number(v.ud_type) === 1 ? require('../../Image/My/zhifubao.png') : require('../../Image/My/bankCard.png')}/>
                                <View style={styles.mainCenterRight}>
                                    <Text style={styles.mainCenterConter}>{Number(v.ud_type) === 1 ? '银行卡' : '支付宝'}提现</Text>
                                    <Text style={styles.mainCenterConterPadd}>金额：{v.ud_amount}元</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                )
            })

        } else {
            List.push(
                <View style={{flex: 1,alignItems:'center',justifyContent: 'center', width: Utils.size.width, height: 400}} key={this.state.page}>
                    <Image style={{width: 80,height: 80}} source={require('../../Image/My/null.png')}/>
                    <Text style={{color: '#505050',fontSize: 20,paddingTop: 10,}}>没有数据</Text>
                </View>
            )
        }
        return List;
    }
    // 返回
    onBackButton () {
        this.props.navigation.goBack();
    }
    // 详情
    OnDetails (record) {
        this.props.navigation.navigate('WithdrawalRecordDetails',  {name: '提现详情' , udKey: record.ud_key, uId: record.u_id})
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
    mainList: {
        paddingTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
        borderBottomColor: '#F1F1F1',
        borderBottomWidth: 1,
    },
    mainListHeader: {
        flexDirection: 'row',
    },
    mainListHeaderTime: {
        color: '#7C7C7C',
        fontSize: Utils.setSpText(14),
    },
    mainListHeaderTimeText: {
        paddingLeft: 20,
        color: '#7C7C7C',
        fontSize: Utils.setSpText(14),
    },
    mainListHeaderRight: {
        color: '#DA3D45',
        fontSize: Utils.setSpText(16),
    },
    mainCenter: {
        paddingTop: 10,
        paddingBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    mainCenterImg: {
        width: 50,
        height: 50,
        borderRadius: 3,
    },
    mainCenterConter: {
        color: '#000',
        fontSize: Utils.setSpText(16),
    },
    mainCenterRight: {
        paddingLeft: 10,
    },
    mainCenterConterPadd: {
        color: '#383838',
        fontSize: Utils.setSpText(14),
        paddingTop: 10,
    }
});

