import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    Animated,
} from 'react-native';
import Utils from "../../../Store/Utils";
import {SwRefreshScrollView} from "react-native-swRefresh";
import {Loading} from "../../../Component/Loading";
import Feedback from './Feedback';
import HelpFeedbackDetails  from './HelpFeedbackDetails';
export default class HelpFeedback extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            page: 1,
            size: 10,
            total: null,
            list: [],
        }
    }
    componentDidMount () {
        this.LoadData();
    }
    async LoadData () {
        try {
            let formData = new FormData();
            formData.append('page', this.state.page);
            formData.append('size', this.state.size);
            let data = await Utils.LoadPost(Utils.size.url + '/v1/course/getHelpers', formData);
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
            _this.LoadData(); //调用接口
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
                <View style={[styles.content]}>
                    {/*<View style={[styles.content]}>*/}

                    {/*</View>*/}
                    <SwRefreshScrollView
                        onRefresh={this._onRefresh.bind(this)}
                        ref="scrollView">
                        <View style={{height: Utils.size.height}}>
                            {this.renderList()}
                        </View>

                    </SwRefreshScrollView>
                    <View style={styles.HelpFeedbackBott}>
                        <TouchableOpacity activeOpacity={0.8} onPress={this.OnFeedback.bind(this)}>
                            <View style={styles.HelpFeedbackBottView}>
                                <Text style={styles.HelpFeedbackBottViewText}>意见反馈</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

            </View>
        );
    }
    renderList () {
        let List = [];
        if (Number(this.state.total) > 0) {
            this.state.list.forEach((v, i) => {
                List.push(
                    <TouchableOpacity activeOpacity={0.8} onPress={this.OnHelpFeedbackDetails.bind(this, v)} key={i}>
                        <View style={styles.HelpFeedbackMain}>
                            <View style={styles.MyCellRow}>
                                <View style={{flex: 1,}}>
                                    <Text style={styles.MyCellText} numberOfLines={1}>{v.h_title}</Text>
                                </View>
                                <Image style={styles.MyCellIconRight} source={require('../../../Image/My/CellRight.png')}/>
                            </View>
                        </View>
                    </TouchableOpacity>
                )
            })
        } else {
            List.push(
                <View style={{flex: 1,alignItems:'center',justifyContent: 'center', width: Utils.size.width, height: 400}} key={this.state.page}>
                    <Image style={{width: 80,height: 80}} source={require('../../../Image/My/null.png')}/>
                    <Text style={{color: '#505050',fontSize: 20,paddingTop: 10,}}>没有数据</Text>
                </View>
            )
        }
        return List;
    }
    OnHelpFeedbackDetails (record) {
        this.props.navigation.navigate('HelpFeedbackDetails', {name: '帮助与反馈详情', data: record,})
    }
    OnFeedback () {
        let _this = this;
        this.props.navigation.navigate('Feedback', {name: '意见反馈',
            ReceiveCode: function () {
                _this.LoadData();
            }})
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
    // 内容:
    HelpFeedbackMain: {
        paddingLeft: 10,
        paddingRight: 10,
    },
    MyCellRow: {
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#EAEAEA',

    },
    MyCellText: {
        color: '#000000',
        fontSize: Utils.setSpText(18),
    },
    MyCellIconRight: {
        width: 14,
        height: 14,
    },
    HelpFeedbackBott: {
        flex: 1,
        paddingLeft: 10,
        paddingRight: 10,
        justifyContent: 'flex-end',
        paddingBottom: 50,
    },
    HelpFeedbackBottView: {
        backgroundColor: '#007BD0',
        height: 45,
        borderRadius: 3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    HelpFeedbackBottViewText: {
        color: '#fff',
        fontSize: Utils.setSpText(16)
    }
});

