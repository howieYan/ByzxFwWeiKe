import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    Animated,
    TextInput,
    AsyncStorage,
} from 'react-native';
import Utils from "../../../Store/Utils";
import {Loading} from "../../../Component/Loading";
import AlertView from "../../../Component/Alert";
export default class Questions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            content: '',
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
        };

    }
    componentDidMount () {
        this.UidLoadData()
    }
    async UidLoadData () {
        try {
            let Uid = await AsyncStorage.getItem('uId');
            this.setState({
                Uid: Uid
            })

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
                                source={require('../../../Image/Back.png')}
                            />
                        </View>
                    </TouchableOpacity>
                    <Animated.Text numberOfLines={1} style={[styles.messageHeaderTitle]}>{this.props.navigation.state.params.name}</Animated.Text>
                    <TouchableOpacity activeOpacity={0.8} onPress={this.onSumbile.bind(this)}>
                        <View style={styles.headerRight}>
                            <Text style={styles.headerRightText}>发布</Text>
                        </View>

                    </TouchableOpacity>
                </View>
                <View style={styles.content}>
                    <View style={styles.LoginHeader}>
                        <View style={styles.LoginInput}>
                            <View style={styles.LoginInputRight}>
                                <TextInput
                                    style={styles.textInputs}
                                    underlineColorAndroid='transparent'
                                    onChangeText={(text) =>this.setState({title: text})}
                                    value={this.state.title}
                                    placeholder={'请写下你的问题...'}
                                />
                            </View>
                        </View>
                        <View style={styles.LoginInputRight}>
                            <TextInput
                                style={styles.textInputs}
                                underlineColorAndroid='transparent'
                                onChangeText={(text) =>this.setState({content: text})}
                                value={this.state.content}
                                placeholder={'填写问题描述...'}
                            />
                        </View>
                    </View>
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
    // 确定提交
    onSumbile () {
        if (this.state.Uid) {
            if (!this.state.title) {
                Loading.Toast('问题不能为空');
            } else if (!this.state.content) {
                Loading.Toast('问题描述不能为空');
            } else {
                this.LoadData()
            }
        } else {
            this.alertEvent();
        }
    }
    alertEvent () {
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
    ToLogin () {
        this.props.navigation.navigate('Login')
    }
    async LoadData () {
        try {
            let formData = new FormData();
            let Uid = await AsyncStorage.getItem('uId');
            formData.append('uId', Uid);
            formData.append('title', this.state.title);
            formData.append('content', this.state.content);
            let data = await Utils.LoadPost(Utils.size.url + '/v1/course/issues', formData);
            if (Number(data.code) === 0) {
                Loading.Toast('发布成功');
                Loading.hidden();
                this.onBackButton();
            } else {
                Loading.Toast(data.message);
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    // 返回
    onBackButton () {
        this.props.navigation.state.params.BackLoad()
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
        borderBottomColor: '#F0F0F0',
        borderBottomWidth: 1,
        paddingTop: ( Utils.size.os === 'ios') ? 30 : 0,
        backgroundColor: '#fff',
    },
    messageHeaderTitle: {
        color: '#101010',
        fontWeight: 'bold',
        fontSize: Utils.setSpText(17),
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
    headerRightText: {
        fontSize: Utils.setSpText(16),
    },
    // 内容
    LoginHeader: {
        // alignItems: 'center',
        justifyContent: 'center',
    },
    LoginHeaderIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    LoginInput: {
        height: 70,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: '#EBEBEB',
        borderBottomWidth: 1,
    },
    LoginInputUser: {
        width: 28,
        height: 28,
    },
    LoginInputUserPwd: {
        width: 28,
        height: 28,
    },
    LoginInputRight: {
        paddingLeft: 10,
        flex: 1,
    },
    textInputs: {
        height: 40,
    },
});

