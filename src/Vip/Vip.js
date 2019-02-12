import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Animated,
} from 'react-native';
import Utils from "../Store/Utils";
import ScrollableTabView, {DefaultTabBar,ScrollableTabBar} from 'react-native-scrollable-tab-view';
import {Loading} from "../Component/Loading";
import CustomTabBar from './Component/CustomTabBar';
import PayCourse from './Component/PayCourse';
import FreeCourse from './Component/FreeCourse';
export default class Vip extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Uid: null,
            isPay: 1,
            page: 1,
            size: 10000,
            total: null,
            list: [],
        }
    }
    componentDidMount () {
        // this.LoadData();
    }
    render() {
        return (
            <View style={styles.content}>
                <View style={styles.messageHeader}>
                    <TouchableOpacity activeOpacity={0.8}
                                      navigator={this.props.navigator}>
                        <View style={styles.headerLeft}>
                            <Text/>
                        </View>
                    </TouchableOpacity>
                    <Animated.Text numberOfLines={1} style={[styles.messageHeaderTitle]}>{'会员课程'}</Animated.Text>
                    <TouchableOpacity activeOpacity={0.8}>
                        <View style={styles.headerRight} >
                            <Text style={styles.headerRightText}>{}</Text>
                        </View>

                    </TouchableOpacity>
                </View>
                <View style={styles.content}>
                    <ScrollableTabView
                        renderTabBar={() =>
                            <CustomTabBar
                                backgroundColor={'#fff'}
                                tabUnderlineDefaultWidth={20} // default containerWidth / (numberOfTabs * 4)
                                tabUnderlineScaleX={2} // default 3
                                activeColor={"#0077C3"}
                                inactiveColor={"#333333"}
                                style={{width: 150}}
                            />}
                        tabBarBackgroundColor='#FFFFFF'>
                        <PayCourse navigation={this.props.navigation} catId={1} tabLabel={'付费课程'}/>
                        <FreeCourse navigation={this.props.navigation} catId={1} tabLabel={'免费课程'}/>
                    </ScrollableTabView>
                </View>
            </View>

        );
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
    mainBgImg: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
    },
    BgImgImage: {
        width: Utils.size.width - 20,
        height: 200,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,.2)',
    },
    UserDetailsActaverName: {
        backgroundColor: 'transparent',
        fontSize: Utils.setSpText(18),
        color: '#fff',
        fontWeight: 'bold',
    }
});

