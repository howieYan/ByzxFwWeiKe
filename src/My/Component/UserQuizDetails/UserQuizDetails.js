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
import Utils from "../../../Store/Utils";
import {SwRefreshScrollView,} from 'react-native-swRefresh';
import {Loading} from "../../../Component/Loading";
import AlertView from '../../../Component/Alert';
export default class OnLineDetails extends React.Component {
    isButton = 0;
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            size: 10,
            list: [],
            total: null,
            Uid: null,
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
    componentDidMount () {
        this.LoadData()
    }
    async LoadData () {
        try {
            Loading.show('努力加载中...')
            let Uid = await AsyncStorage.getItem('uId');
            let formData = new FormData();
            formData.append('qId', this.props.navigation.state.params.data.q_id);
            let data = await Utils.LoadPost(Utils.size.url + '/v1/course/getReply', formData);
            if (Number(data.code) === 0) {
                this.setState({
                    list: data.result.list,
                    total: data.result.total,
                    Uid: Uid
                })
            }
            Loading.hidden();
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
        },1500)
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
                    <Animated.Text numberOfLines={1} style={[styles.messageHeaderTitle]}>{this.props.navigation.state.params.name}</Animated.Text>
                    <TouchableOpacity activeOpacity={0.8}>
                        <View style={styles.headerRight} >
                            <Text style={styles.headerRightText}>{}</Text>
                        </View>

                    </TouchableOpacity>
                </View>
                <View style={styles.content}>
                    <View style={styles.main}>
                        <View style={styles.title}>
                            <Text style={styles.titleText}>{this.props.navigation.state.params.data.q_title}</Text>
                        </View>
                        {this.props.navigation.state.params.data.u_id === this.state.Uid ?
                            <TouchableOpacity activeOpacity={0.8}
                                              navigator={this.props.navigator}
                                              onPress={this.onDelQuestion.bind(this)}>
                                <Text style={{paddingTop: 10, color: '#989898',fontSize: Utils.setSpText(17)}}>删除</Text>
                            </TouchableOpacity>
                            : null}
                        <Text style={styles.titleConter}>
                            {this.props.navigation.state.params.data.q_content}
                        </Text>
                        <View style={styles.titleAuthor}>
                            <Text style={styles.author}>{this.props.navigation.state.params.data.u_nickname}</Text>
                            <Text style={styles.authorBorder}>|</Text>
                            <View style={{flex: 1}}>
                                <Text style={styles.authorTime}>{this.props.navigation.state.params.data.q_created}</Text>
                            </View>
                            <Text style={styles.authorAnswer}>{this.props.navigation.state.params.data.q_answer_number}个回答</Text>
                        </View>
                    </View>
                    {
                        Number(this.state.total) > 0
                            ?
                            <View style={styles.mainList}>
                                <SwRefreshScrollView
                                    onRefresh={this._onRefresh.bind(this)}
                                    ref="scrollView"
                                    showsVerticalScrollIndicator={false}
                                    //其他你需要设定的属性(包括ScrollView的属性)
                                >
                                    {this.renderList()}
                                </SwRefreshScrollView>
                            </View>
                            :
                            <View style={{width: Utils.size.width - 40, height: 400, alignItems: 'center',justifyContent: 'center'}}>
                                <Image style={{width: 50,height: 50,}} source={require('../../../Image/My/null.png')}/>
                                <Text style={{paddingTop: 20}}>还没有回答，赶快来抢沙发吧！</Text>
                            </View>
                    }
                </View>
                {this._renderAndroidAlert()}
            </View>
        );
    }
    // 弹窗
    _renderAndroidAlert() {
        return(
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
    // 取消弹窗
    rightClick = () => {
        this.refs.alert && this.refs.alert.hideAlertView();
    }
    PublishedAnswer (record) {
        this.isButton++;
        if (Number(this.isButton) === 1) {
            let _this = this;
            if (this.state.Uid) {
                this.props.navigation.navigate('PublishedAnswer', {name: '发表回答',data: record,
                    BackLoad: function () {
                        _this.LoadData();
                    }
                })
            } else {
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
        }
    }
    // 删除
    onDelQuestion () {
        this.LoadDel()
    }
    async LoadDel () {
        try {
            let formData = new FormData();
            formData.append('qId', this.props.navigation.state.params.data.q_id);
            formData.append('uId', this.state.Uid);
            let data = await Utils.LoadPost(Utils.size.url + '/v1/course/delQuestion', formData);
            if (Number(data.code) === 0) {
                Loading.Toast('删除成功');
                this.onBackButton();
            } else {
                Loading.Toast(data.message);
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    ToLogin () {
        this.props.navigation.navigate('Login')
    }
    // 返回
    onBackButton () {
        this.props.navigation.state.params.BackLoad();
        this.props.navigation.goBack();
    }
    renderList () {
        let List = [];
        if (Number(this.state.total) > 0) {
            this.state.list.forEach((v, i) => {
                List.push(
                    <View style={styles.mainListCard} key={i}>
                        <View style={styles.CardHeader}>
                            <Image style={styles.cardUser} source={{uri: v.u_avatar}}/>
                            <Text style={styles.cardUserName}>{v.u_nickname}</Text>
                        </View>
                        <View style={styles.CardMain}>
                            <Text style={styles.CardMainCaonter}>
                                {v.qa_content}
                            </Text>
                        </View>
                        <View style={styles.CardImgNav}>
                            { this.renderListImg(v.qa_attachment)}
                        </View>
                        <View style={styles.CardMainBottom}>
                            <View style={styles.CardMainBottomTitme}>
                                <Text style={styles.CardMainBottomTitmeText}>{v.qa_created}</Text>
                            </View>
                            <TouchableOpacity activeOpacity={0.8}
                                              navigator={this.props.navigator}
                                              onPress={this.PublishedAnswer.bind(this, v)}>
                                <Text style={styles.CardMainBottomButton}>回复</Text>
                            </TouchableOpacity>
                        </View>
                        {this.renderListSub(v.sub)}
                    </View>
                )
            })
        }
        return List;
    }
    renderListImg (record) {
        let List = [];
        if (record.length > 0) {
            record.forEach((v, i) => {
                List.push(
                    <View style={styles.CardImg} key={i}>
                        <View style={styles.CardImgPadd}>
                            <Image style={styles.CardImgPaddImage} source={{uri: v}}/>
                        </View>
                    </View>
                )
            })
        }
        return List;
    }
    renderListSub (record) {
        let List = [];
        if (record.length > 0) {
            record.forEach((v, i) => {
                List.push(
                    <View key={i}>
                        <Text style={{color: '#B5B5B5', fontSize: Utils.setSpText(16)}}>他收到的回复</Text>
                        <View style={styles.CardHeader}>
                            <Image style={styles.cardUser} source={{uri: v.u_avatar}}/>
                            <Text style={styles.cardUserName}>{v.u_nickname}</Text>
                        </View>
                        <View style={styles.CardMain}>
                            <Text style={styles.CardMainCaonter}>
                                {v.qa_content}
                            </Text>
                        </View>
                        <View style={styles.CardImgNav}>
                            { this.renderListImg(v.qa_attachment)}
                        </View>
                        <View style={styles.CardMainBottom}>
                            <View style={styles.CardMainBottomTitme}>
                                <Text style={styles.CardMainBottomTitmeText}>{v.qa_created}</Text>
                            </View>
                        </View>
                    </View>
                )
            })
        }
        return List;
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
        borderBottomColor: '#F1F1F1',
        paddingTop: ( Utils.size.os === 'ios') ? 30 : 0,
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
    main: {
        paddingRight: 10,
        paddingLeft: 10,
        backgroundColor: '#fff',
    },
    title: {
        paddingTop: 10,
    },
    titleText: {
        color: '#3D3D3D',
        fontSize: Utils.setSpText(16),
    },
    titleConter: {
        paddingTop: 10,
        lineHeight: 20,
        color: '#989898',
        fontSize: Utils.setSpText(13),
    },
    titleAuthor: {
        flexDirection: 'row',
        paddingTop: 10,
        alignItems: 'center',
        paddingBottom: 10,
    },
    author: {
        color: '#7DBAEA',
        fontSize: Utils.setSpText(13),
    },
    authorBorder: {
        paddingLeft: 10,
        paddingRight: 10,
        color: '#D0D0D0',
        fontSize: Utils.setSpText(13),
    },
    authorTime: {
        color: '#D0D0D0',
        fontSize: Utils.setSpText(13),
    },
    authorAnswer: {
        color: '#D0D0D0',
        fontSize: Utils.setSpText(13),
    },
    mainList: {
        paddingRight: 20,
        paddingLeft: 20,
        paddingTop: 15,
        backgroundColor: '#F4F4F4',
        flex: 1,
    },
    mainListCard: {
        backgroundColor: '#fff',
        paddingLeft: 10,
        paddingRight: 10,
        marginBottom: 15,
    },
    CardHeader: {
        flexDirection: 'row',
        paddingTop: 10,
        alignItems: 'center',
    },
    cardUser: {
        width: 30,
        height: 30,
        borderRadius: 15,
    },
    cardUserName: {
        paddingLeft: 10,
        color: '#979797',
        fontSize: Utils.setSpText(13),
    },
    CardMain: {
        paddingTop: 10,
    },
    CardMainCaonter: {
        color: '#919191',
        fontSize: Utils.setSpText(13),
        lineHeight: 20,
    },
    CardMainBottom: {
        paddingTop: 10,
        paddingBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    CardMainBottomTitme: {
        flex: 1,
    },
    CardMainBottomTitmeText: {
        color: '#B6B6B6',
        fontSize: Utils.setSpText(13),
    },
    CardMainBottomButton: {
        color: '#009DE4',
        fontSize: Utils.setSpText(13),
    },
    CardReply: {
        paddingTop: 10,
        paddingBottom: 10,
        color: '#D0D0D0',
        fontSize: Utils.setSpText(15),
    },
    OnLineDetailsBott: {
        justifyContent: 'flex-end',
    },
    OnLineMainBottStyle: {
        flexDirection: 'row',
        height: 50,
        alignItems: 'center',
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    OnLineMainBottStyleIcon:{
        width: 20,
        height: 20,
    },
    OnLineMainBottStyleText: {
        paddingLeft: 10,
        color: '#616161',
        fontSize: Utils.setSpText(16),
    },
    CardImgNav: {
        marginTop: 10,
        flexDirection:'row',
        paddingLeft: 10,
        flexWrap:'wrap'
    },
    CardImg: {
        width: (Utils.size.width - 70) / 3,
        justifyContent: 'center',
    },
    CardImgPadd: {
        paddingRight: 10,
        paddingBottom: 10,
    },
    CardImgPaddImage: {
        width: '100%',
        height: 80,
    }
});

