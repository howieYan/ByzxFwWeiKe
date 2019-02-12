import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    Animated,
    ScrollView,
    AsyncStorage
} from 'react-native';
import Utils from "../../Store/Utils";
import UserQuizDetails from './UserQuizDetails/UserQuizDetails';
import {Loading} from "../../Component/Loading";
export default class UserQuiz extends React.Component {
    constructor(props) {
        super(props);
        this.state= {
            page: 1,
            size: 1999,
            list: [],
            total: null,
        }
    }
    componentDidMount () {
        this.LoadData()
    }
    async LoadData () {
        try {
            let Uid = await AsyncStorage.getItem('uId');
            let formData = new FormData();
            formData.append('uId', Uid);
            formData.append('page', this.state.page);
            formData.append('size', this.state.size);
            let data = await Utils.LoadPost(Utils.size.url + '/v1/course/question', formData);
            if (Number(data.code) === 0) {
                this.setState({
                    list: data.result.list,
                    total: data.result.total,
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
                <ScrollView>
                    <View style={[styles.content]}>
                        <View style={styles.Main}>
                            <Text style={styles.Title}>共{this.state.total}个提问</Text>
                            {this.renderList()}
                        </View>
                    </View>

                </ScrollView>
            </View>
        );
    }
    renderList () {
        let List = [];
        if (Number(this.state.total) > 0) {
            this.state.list.forEach((v, i) => {
                List.push(
                    <TouchableOpacity activeOpacity={0.8} key={i}
                                      navigator={this.props.navigator}
                                      onPress={this.OnQuizButton.bind(this, v)}>
                        <View style={styles.MainList}>
                            <Text style={styles.MainListTitle} numberOfLines={2}>{v.q_title}</Text>
                            <View style={styles.MainListBottom}>
                                <View style={{flex: 1}}>
                                    <Text style={styles.MainListBottomTime}>{v.q_created}</Text>
                                </View>
                                <Text style={styles.MainListBottomDa}>{v.q_answer_number}个回答</Text>
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
    OnQuizButton (record) {
        let _this = this;
        this.props.navigation.navigate('UserQuizDetails', {name: '详情', data: record,
            BackLoad: function () {
                _this.LoadData();
            }
        })
    }
    // 返回
    onBackButton () {
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
    Main: {
        paddingRight: 10,
        paddingLeft: 10,
        backgroundColor: '#fff',
    },
    Title: {
        color: '#007DD2',
        fontSize: Utils.setSpText(17),
        paddingTop: 15,
        paddingBottom: 5,
    },
    MainList: {
        paddingTop: 10,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#EAEAEA',
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
    }
});

