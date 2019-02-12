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
import CustomTabBar from "../UserCollect/Component/CustomTabBar";
import PayCourse from "../UserCollect/Component/PayCourse";
import FreeCourse from "../UserCollect/Component/FreeCourse";
import ScrollableTabView from "react-native-scrollable-tab-view";

export default class UserCollect extends React.Component {
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
});


