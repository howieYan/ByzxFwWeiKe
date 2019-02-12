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
export default class Setting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            u_mobile: ''
        }
    }
    componentDidMount () {
        this.setState({
            u_mobile: this.props.navigation.state.params.data.u_mobile,
        })
    }
    render() {
        return (
            <View style={styles.content}>
                <View style={styles.messageHeader}>
                    <TouchableOpacity activeOpacity={0.8}
                                      navigation={this.props.navigation}
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
                <View style={[styles.content,styles.contentBg]}>
                    <View style={styles.phone}>
                        <Text style={styles.phoneText}>
                            {this.state.u_mobile}
                        </Text>
                    </View>
                    {this.renderList()}
                    <View style={{flex: 1, justifyContent: 'flex-end', paddingLeft: 10,paddingRight:10,paddingBottom: 50,}}>
                        <TouchableOpacity activeOpacity={0.8} onPress={this.OnClose.bind(this)}>
                            <View style={{backgroundColor: '#4089D3', height: 45, justifyContent: 'center', alignItems: 'center', borderRadius: 5}}>
                                <Text style={{color: '#fff', fontSize: Utils.setSpText(16)}}>退出登录</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
    renderList () {
        let List = [];
        let Array = [
            {title: '修改密码', icon: require('../../Image/My/ChangePwd.png'), component: 'ChangePwd'},
            {title: '更换手机号码', icon: require('../../Image/My/PhoneIcon.png'), component: 'ReplacePhone'},
        ];
        Array.forEach((v, i) => {
            List.push(
                <TouchableOpacity activeOpacity={0.8} key={i} onPress={this.onCellButton.bind(this, v)}>
                    <View style={styles.Cell}>
                        <View style={styles.MyCellRow}>
                            <Image style={styles.MyCellIcon} source={v.icon}/>
                            <View style={{flex: 1,height: 40, justifyContent: 'center'}}>
                                <Text style={styles.MyCellText}>{v.title}</Text>
                            </View>
                            <Image style={styles.MyCellIconRight} source={require('../../Image/My/CellRight.png')}/>
                        </View>
                    </View>

                </TouchableOpacity>
            )
        })
        return List;
    }
    // 退出登录
    OnClose () {
        AsyncStorage.removeItem('uId');
        this.setState({
            uId: null,
        })
        this.onBackButton()
    }
    onCellButton (record) {
        let _this = this;
        let data = this.props.navigation.state.params.data
        this.props.navigation.navigate(record.component, {
            name: record.title,
            data: data,
            BackLoad: function (mobile) {
                _this.setState({
                    u_mobile: mobile,
                })
            }})
    }
    // 返回
    onBackButton () {
        this.props.navigation.state.params.ReceiveCode();
        this.props.navigation.goBack();
    }
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
    },
    contentBg: {
        backgroundColor: '#F4F4F4',
        flex: 1
    },
    messageHeader: {
        height: (Utils.size.os === 'ios') ? 74 : 42,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 10,
        paddingRight: 10,
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
    phone: {
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    phoneText: {
        color: '#090909',
        // fontWeight: 'bold',
        fontSize: Utils.setSpText(25),
    },
    Cell: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F1F1',
    },
    MyCellRow: {
        alignItems: 'center',
        flex: 1,
        height: 40,
        flexDirection: 'row',
        paddingTop: 15,
        paddingBottom: 15,
    },
    MyCellIcon: {
        width: 22,
        height: 22,
    },
    MyCellText: {
        color: '#000000',
        paddingLeft: 10,
        fontSize: Utils.setSpText(16),
    },
    MyCellIconRight: {
        width: 14,
        height: 14,
    },
});

