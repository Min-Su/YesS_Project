package com.example.phonegap;

import org.apache.cordova.CordovaActivity;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.DroidGap;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.webkit.JavascriptInterface;

public class MainActivity extends DroidGap {
	
	private CordovaWebView webView;
    
	public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        super.init();
        
        webView = appView;
        
        webView.getSettings().setJavaScriptEnabled(true);
        webView.addJavascriptInterface(new customPGInterface(), "customPG");
        webView.loadUrl("file:///android_asset/www/html/index.html");  
    }
    
    public class customPGInterface {
    	@JavascriptInterface
    	public void showActivity() {
    		Intent intent = new Intent(MainActivity.this, AttentionActivity.class);
    		startActivity(intent);
    	}
    	@JavascriptInterface
    	public void dropActivity() {
    		finish();
    	}
    	@JavascriptInterface
    	public void sendKakaoMsg(String url, String appName) {
    		KakaoLink kakaoLink = KakaoLink.getLink(getApplicationContext());
    		
    		String strMessage = "강의주소입니다.";
    		String strURL = url;
    		String strAppId = "com.example.phonegap";
    		String strAppVer = "1.0";
    		String strAppName = appName;
    		
    		kakaoLink.openKakaoLink(MainActivity.this, strURL, strMessage, strAppId, strAppVer, strAppName, "UTF-8");
    	}
    }
}
