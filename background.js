// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

function iconGreen() {
  chrome.browserAction.setIcon({path:"icon/icon2.png"});
}

function iconBlack() {
  chrome.browserAction.setIcon({path:"icon/icon.png"});
}

chrome.browserAction.onClicked.addListener(iconGreen);