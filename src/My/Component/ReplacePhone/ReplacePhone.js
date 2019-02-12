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
export default class ReplacePhone extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mobile: '',
            verifyCode: '',
            CodeName: '获取验证码',
            u_mobile: '',
        }
    }
    componentDidMount () {
        this.setState({
            u_mobile: this.props.navigation.state.params.data.u_mobile
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
                        <Text style={styles.phoneText}>当前手机号</Text>
                        <Text style={styles.phone}>{this.state.u_mobile}</Text>
                        <View style={styles.mainList}>
                            <View style={{flex: 1}}>
                                <TextInput
                                    underlineColorAndroid='transparent'
                                    style={styles.UserInput}
                                    maxLength={11}
                                    onChangeText={(text) => this.setState({mobile: text})}
                                    value={this.state.mobile}
                                    placeholder={'输入新手机号'}
                                />
                            </View>
                        </View>
                        <View style={styles.mainList}>
                            <View style={{flex: 1}}>
                                <TextInput
                                    underlineColorAndroid='transparent'
                                    style={styles.UserInput}
                                    onChangeText={(text) => this.setState({verifyCode: text})}
                                    value={this.state.verifyCode}
                                    placeholder={'输入手机验证码'}
                                />
                            </View>
                            <TouchableOpacity activeOpacity={0.8} onPress={this.OnCode.bind(this)}>
                                <Text style={styles.mainCode}>
                                    {this.state.CodeName}
                                </Text>
                            </TouchableOpacity>

                        </View>
                        <TouchableOpacity activeOpacity={0.8} onPress={this.OnRegiste.bind(this)}>
                            <View style={styles.button}>
                                <Text style={styles.buttonText}>完成</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

            </View>
        );
    }
    OnRegiste () {
        if (!this.state.mobile) {
            Loading.Toast('手机号码不能为空');
        } else if (!this.state.verifyCode) {
            Loading.Toast('验证码不能为空');
        } else {
            this.LoadRegiste();
        }
    }
    async LoadRegiste () {
        try {
            let Uid = await AsyncStorage.getItem('uId');
            let formData = new FormData();
            formData.append('mobile', this.state.mobile);
            formData.append('uId', Uid);
            formData.append('verifyCode', this.state.verifyCode);
            let data = await Utils.LoadPost(Utils.size.url + '/v1/account/changeMobile', formData);
            if (Number(data.code) === 0) {
                this.setState({
                    u_mobile: data.result.u_mobile
                })
                Loading.Toast('修改手机号码成功');
                Loading.hidden();
                this.onBackButton()
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
        this.props.navigation.state.params.BackLoad(this.state.u_mobile);
        this.props.navigation.goBack();
    }
    // 获取验证码
    OnCode () {
        if (this.state.mobile) {
            let time = 60;
            this.LoadCode();
            let _this = this;
            let int = setInterval(function () {
                time --;
                _this.setState({
                    CodeName: '重新获取' + (time) + 's后',
                })
                if (time === 0) {
                    _this.setState({
                        CodeName: '获取验证码',
                    })
                    clearInterval(int);
                }
            }, 1000);
        } else {
            Loading.Toast('手机号码不能为空')
        }
    }
    // 获取验证码接口
    async LoadCode () {
        try {
            let formData = new FormData();
            formData.append('mobile', this.state.mobile);
            let data = await Utils.LoadPost(Utils.size.url + '/v1/auth/getCode', formData);
            if (Number(data.code) === 0) {
                Loading.Toast('获取验证码成功')
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
    contentBg: {
        flex: 1
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
    main: {
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
    },
    phoneText: {
        color: '#000',
        fontSize: Utils.setSpText(14),
        paddingTop: 30,
        paddingBottom: 30,
    },
    phone: {
        color: '#3B86D4',
        fontSize: Utils.setSpText(25),
        paddingBottom: 30,
    },
    mainList: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 15,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFEF',
    },
    mainListText: {
        color: '#000',
        fontSize: Utils.setSpText(16),
    },
    UserInput: {
        height: 40,
    },
    mainCode: {
        color: '#000000',
        fontSize: Utils.setSpText(16),
    },
    button: {
        width: Utils.size.width - 20,
        marginTop: 30,
        backgroundColor: '#4189D5',
        height: 50,
        borderRadius: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: Utils.setSpText(16),
    }
});

