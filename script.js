"use strict";
/*** Twitch Highlighted Chat - lite ***/
/*** By QuentinPerou ***/

/*  lite-v2  */

(function () {
    document.addEventListener("DOMContentLoaded", initialiser);

    /*********************************************************/
    /*                 DECLATATION VARIABLES                 */
    /*********************************************************/
    let channelInUrl;
    let storagePrefix = 'HgltCt-';
    let onlyHighlighted = true;
    let scollBottom = true;
    let highlightedNotifSound = false;

    let messagesSave = true;
    let deleteOldMessages = true;
    let enableModCommand = true;
    // let linkIsClickable = true;
    // let mentionIsColorised = false;

    /*********************************************************/
    /*                   FONCTION PRINCIPALE                 */
    /*********************************************************/
    function initialiser() {
        console.log("%cHello ! Enjoy Highlighted Chat 😃\n 🌸🌸🌸🌸🌸", "background: #222; color: #FFF; font-size: 20px;");

        document.getElementById('notCoChannelInputSubmit').addEventListener('click', function () {
            if (document.getElementById('notCoChannelInput').value)
                window.location.href = `./?channel=${document.getElementById('notCoChannelInput').value.toLowerCase()}`;
        }, { passive: true });

        document.getElementById('notCoChannelInput').focus();
        document.getElementById('notCoChannelInput').addEventListener('keydown', (e) => {
            if (!e.repeat)
                if (e.key == 'Enter')
                    document.getElementById('notCoChannelInputSubmit').click();
        });

        document.getElementById('backToHomeButton').addEventListener('click', function () {
            ComfyJS.Disconnect();
            window.location.href = "./";
        }, { passive: true });

        document.getElementById("onlyHighlightedCheck").addEventListener("input", function () {
            if (document.getElementById("onlyHighlightedCheck").checked) {
                onlyHighlighted = true;
                remove('[data-type="normal"]');
            } else {
                onlyHighlighted = false;
            }
        });
        document.getElementById("highlightedNotifSound").addEventListener("input", function () {
            if (document.getElementById("highlightedNotifSound").checked) {
                highlightedNotifSound = true;
            } else {
                highlightedNotifSound = false;
            }
        });
        document.getElementById("enableModCommand").addEventListener("input", function () {
            if (document.getElementById("enableModCommand").checked)
                enableModCommand = true;
            else
                enableModCommand = false;
        });
        // document.getElementById("linkIsClickable").addEventListener("input", function () {
        //     if (document.getElementById("linkIsClickable").checked)
        //         linkIsClickable = true;
        //     else
        //         linkIsClickable = false;
        // });

        if (sessionStorage.getItem(`${storagePrefix}theme`) != undefined) {
            document.querySelector(`#choiceTheme input[value="${sessionStorage.getItem(`${storagePrefix}theme`)}"]`).checked = true;
            changeTheme(sessionStorage.getItem(`${storagePrefix}theme`));
        }
        document.querySelectorAll('#choiceTheme input').forEach(function (elm) {
            elm.addEventListener("input", function () {
                if (elm.checked) {
                    sessionStorage.setItem(`${storagePrefix}theme`, elm.value);
                    console.log("theme:", elm.value);
                    changeTheme(elm.value);
                }
                else
                    console.log("false", elm.value);
            });
        });
        function changeTheme(theme) {
            if (theme == "original")
                document.documentElement.style.cssText = `--main-bg-color0: #34495E;
                        --main-bg-color1: #273240;
                        --main-bg-color2: #18181B;
                        --main-text-color0: white;
                        --main-text-color2: #bdc2c4;
                        --main-color0: #161c22;
                        --main-color2: #39c0d2;
                        --main-color3: #47e9ff;
                        --main-button-ratio-color:#39c0d2;
                        --main-button-color:#39c0d2;
                        --main-button-text-color:var(--main-color0);
                        --main-background-transparent-1:#18181bbd;
                        --main-bg-title: var(--main-color2);
                        --main-title-border: none; 
                        --main-box-shadow: 0 5px 5px var(--main-bg-color2);`;
            if (theme == "dark")
                document.documentElement.style.cssText = `--main-bg-color0: #0E0E10;
                        --main-bg-color1: #18181B;
                        --main-bg-color2: #1F1F23;
                        --main-text-color0: white;
                        --main-text-color2: #6c6c6c;
                        --main-color0: #161c22;
                        --main-color2: #9147FF;
                        --main-color3: #772CE8;
                        --main-button-ratio-color:#a970ff;
                        --main-button-color:#9147FF;
                        --main-button-text-color:var(--main-text-color0);
                        --main-background-transparent-1:#35353bbd;
                        --main-bg-title: var(--main-bg-color1);
                        --main-title-border: 1px solid var(--main-text-color2);
                        --main-box-shadow: 0 5px 5px var(--main-bg-color1);`;
        }
        document.getElementById('hightlitedMessageChatContainer').addEventListener('click', function () {
            document.getElementById('headerBurger').classList.remove('menuVisible');
            document.getElementById('headerNav').classList.remove('menuVisible');
        });

        document.getElementById('headerBurger').addEventListener('click', function () {
            this.classList.toggle('menuVisible');
            document.getElementById('headerNav').classList.toggle('menuVisible');
        });

        document.getElementById('chatGoToBottom').addEventListener('click', function () {
            let objDiv = document.getElementById("hightlitedMessageChatContainer");
            objDiv.scrollTop = objDiv.scrollHeight;
            hide('#chatGoToBottom');
            scollBottom = true;
        }, { passive: true });

        /***************************/

        console.log(location.search.substr(1));
        if (location.search.substr(1).split('=')[0] == "channel") {
            channelInUrl = location.search.substr(1).split('=')[1].toLowerCase();
            if (channelInUrl) {
                ComfyJS.Init(channelInUrl);

                let titleChat = document.querySelector('.titleChat p');
                titleChat.innerHTML = titleChat.textContent + '<span translate="no">' + channelInUrl + '</span>';

                fetch(`https://decapi.me/twitch/avatar/${channelInUrl}`)
                    .then(function (response) {
                        return response.text();
                    })
                    .then(function (body) {
                        // console.log(body);
                        let channelProfilePicture = document.createElement('div');
                        let channelProfilePictureLink = document.createElement('a');
                        channelProfilePictureLink.href = `https://twitch.tv/${channelInUrl}`;
                        channelProfilePictureLink.target = '_blank';
                        let channelProfilePicturePic = document.createElement('img');
                        channelProfilePicturePic.src = body;
                        channelProfilePicturePic.id = "channelProfilePicturePic";
                        channelProfilePicturePic.alt = "profile picture";
                        channelProfilePicture.appendChild(channelProfilePictureLink);
                        channelProfilePictureLink.appendChild(channelProfilePicturePic);
                        document.querySelector('.titleChat').insertBefore(channelProfilePicture, document.querySelector('.titleChat p'));
                        ///// Color picker on profile picture /////
                        // colorjs.prominent(body, { amount: 2, format: 'hex', group: 30 }).then(color => {
                        //     console.log(color[0])
                        //     let originalColor = tinycolor(color[0]);
                        //     let newColorBright = originalColor.brighten(25).toString();
                        //     document.documentElement.style.cssText = `--main-color2: ${color[0]}; --main-color3: ${newColorBright}; --main-highlight-color:#34495e; --main-highlight-read-color:#19242e;`;
                        // })
                    });

                //// easter-egg ////
                if (channelInUrl == 'ponce')
                    titleChat.textContent = '🌸 ' + titleChat.textContent + ' 🌸';

                //// rewrite title of this page
                document.title = `${channelInUrl} - Twitch Highlighted Chat`;
                displayConnectInterface();

                ComfyJS.onConnected = (address, port, isFirstConnect) => {
                    displayNotif(`Chat of <i>${channelInUrl.toUpperCase()}</i>`);
                    ///// restore saved messages /////
                    if (messagesSave) {
                        if (sessionStorage.getItem(`${storagePrefix}messagesSave-${channelInUrl}`) != undefined) {
                            let savedElem = JSON.parse(sessionStorage.getItem(`${storagePrefix}messagesSave-${channelInUrl}`));
                            savedElem.forEach(function (el) {
                                if (el.isRead)
                                    addMessage(el.user, el.message, el.flags, el.self, el.extra, true).setAttribute('read', '');
                                else
                                    addMessage(el.user, el.message, el.flags, el.self, el.extra, true);
                            });
                        }
                    }
                }
                ComfyJS.onChat = (user, message, flags, self, extra) => {
                    // console.log('- MESSAGE (channel, user, msg) ► ', extra.channel, '►', user, '►', message);
                    if (!onlyHighlighted)
                        addMessage(user, message, flags, self, extra);
                    if (flags.highlighted == true) {
                        if (onlyHighlighted)
                            addMessage(user, message, flags, self, extra);
                        if (messagesSave) {
                            saveMessage(user, message, flags, self, extra);
                        }
                    }
                }
                ComfyJS.onCommand = (user, command, message, flags, extra) => {
                    // console.log(user, command, message, flags, extra);
                    if (enableModCommand && command === "+hmsg" && (flags.broadcaster || flags.mod || user.toLowerCase() == 'quentinperou')) {
                        if (!flags.highlighted) {
                            let thisMessage = addMessage(user, message, flags, false, extra, false);
                            thisMessage.style.backgroundColor = "var(--main-bg-color0)";
                            thisMessage.style.padding = '2px 5px';
                        }
                        else {
                            addMessage(user, '!' + command + ' ' + message, flags, false, extra);
                            saveMessage(user, '!' + command + ' ' + message, flags, false, extra);
                        }
                    } else if (!onlyHighlighted) {
                        addMessage(user, '!' + command + ' ' + message, flags, false, extra);
                    } else if (flags.highlighted) {
                        addMessage(user, '!' + command + ' ' + message, flags, false, extra);
                    }
                }
                ComfyJS.onError = (error) => {
                    console.log(error);
                }
            }
        } ///////////////////////////////////////

        /****** Scroll ******/
        document.getElementById('hightlitedMessageChatContainer').addEventListener('wheel', function onScroll(evt) {
            if (evt.deltaY < 0) {
                if (this.clientHeight != this.scrollHeight) {
                    scollBottom = false;
                    show('#chatGoToBottom');
                }
            } else if (evt.deltaY > 0) {
                if (this.scrollTop + this.clientHeight == this.scrollHeight) {
                    scollBottom = true;
                    hide('#chatGoToBottom');
                }
            }
        }, { passive: true });

    } //************* END FONCTION PRINCIPALE **************/
    //*********************************************************************************/

    function displayNotConnectInterface() {
        // hide('#backToHomeButton');
        hide('#optionsDiv');
        hide('.divConnect');
        show('.divNotConnect');
        document.getElementById('headerBurger').classList.remove('diplayOn');
    }
    function displayConnectInterface() {
        // show('#backToHomeButton');
        show('#optionsDiv');
        show('.divConnect');
        hide('.divNotConnect');
        document.getElementById('headerBurger').classList.add('diplayOn');
    }

    function displayNotif(texteNotif) {
        var uniqueId = Math.floor(Math.random() * Date.now())
        document.getElementById('notifContainer').innerHTML += `<div class="oneNotifContainer hide"> <div id="notifNow${uniqueId}" class="notif"> <p class="notifTitle">${texteNotif}</p> </div></div>`;
        setTimeout(function () {
            document.getElementById(`notifNow${uniqueId}`).parentElement.classList.remove('hide');
        }, 10);
        setTimeout(function () {
            document.getElementById(`notifNow${uniqueId}`).parentElement.classList.add('hide');
            setTimeout(function () {
                document.getElementById(`notifNow${uniqueId}`).parentElement.remove();
            }, 400);
        }, 2700);
    }

    function saveMessage(user, message, flags, self, extra) {
        if (sessionStorage.getItem(`${storagePrefix}messagesSave-${channelInUrl}`) == undefined) {
            let msgToSave = { user, message, flags, self, extra, isRead: false };
            sessionStorage.setItem(`${storagePrefix}messagesSave-${channelInUrl}`, JSON.stringify([msgToSave]));
        } else {
            let msgToSave = { user, message, flags, self, extra, isRead: false };
            let data = JSON.parse(sessionStorage.getItem(`${storagePrefix}messagesSave-${channelInUrl}`));
            data.push(msgToSave);
            sessionStorage.setItem(`${storagePrefix}messagesSave-${channelInUrl}`, JSON.stringify(data));
        }
    }

    function addMessage(user, message, flags, self, extra, isArchive) {
        if (isArchive == undefined)
            isArchive = false;
        // console.log(extra);
        // console.log(flags);
        // console.log(user, message, flags, self, extra, isArchive);
        let thisMsgId = extra.id;
        let leMessage = message.toString();

        let messageDate = new Date();
        let messagHours = "0" + messageDate.getHours();
        let messagMinutes = "0" + messageDate.getMinutes();
        messagHours = messagHours.substr(-2);
        messagMinutes = messagMinutes.substr(-2);

        ///////// Sub Badge /////////
        let badgeInfos = "";
        if (flags.subscriber == true) {
            if (extra.userBadges.subscriber != undefined)
                if ((extra.userBadges.subscriber).length == 4)
                    badgeInfos = `(Tier ${extra.userBadges.subscriber.match(/^[0-9]/g)[0]})`;
        }

        //////// Create message div ////////
        let newMessageDiv = document.createElement('div');
        newMessageDiv.classList.add("chat-lineMessage");

        let newMessageName = document.createElement('div');
        newMessageName.classList.add("chat-lineNameDiv");
        newMessageDiv.appendChild(newMessageName);
        newMessageName.innerHTML = `${flags.mod ? '<img src="img/mod.png" title="Moderator" class="chat-lineBadge">' : ''}
                                    ${flags.vip ? '<img src="img/vip.png" title="VIP" class="chat-lineBadge">' : ''}
                                    ${flags.broadcaster ? '<img src="img/broadcaster.png" title="Broadcaster" class="chat-lineBadge">' : ''}
                                    ${flags.subscriber ? `<img src="img/sub.png" title="${extra.userState['badge-info'].match(/[0-9]+$/g)}-Month Subscriber ${badgeInfos}" class="chat-lineBadge">` : ''}
                                    <span class="chat-lineName" translate="no">${user}</span>`;
        if (!isArchive) {
            let newMessageTime = document.createElement('span');
            newMessageTime.classList.add("chat-messageTime");
            newMessageTime.textContent = `${messagHours}:${messagMinutes}`;
            newMessageName.prepend(newMessageTime);
        }

        let messageSeparator = document.createElement('span');
        messageSeparator.classList.add("chat-messageSeparator");
        messageSeparator.textContent = ": ";
        // newMessageDiv.appendChild(messageSeparator);
        newMessageName.appendChild(messageSeparator);

        let messageContent = document.createElement('span');
        messageContent.classList.add("chat-message");
        messageContent.setAttribute("translate", "no");
        if (flags.highlighted == true) {
            messageContent.classList.add('chat-message-highlighted');
            newMessageDiv.setAttribute("data-type", "highlighted");
            messageContent.setAttribute("title", "Click to mark as read");
            messageContent.addEventListener("click", function () {
                let elemSave = JSON.parse(sessionStorage.getItem(`${storagePrefix}messagesSave-${channelInUrl}`));
                let elemSaveThisIndex = elemSave.findIndex(elem => elem.extra.id == thisMsgId);
                if (this.hasAttribute('read')) {
                    this.removeAttribute('read');
                    elemSave[elemSaveThisIndex].isRead = false;
                } else {
                    this.setAttribute('read', '');
                    elemSave[elemSaveThisIndex].isRead = true;
                }
                sessionStorage.setItem(`${storagePrefix}messagesSave-${channelInUrl}`, JSON.stringify(elemSave));
                // console.log('Elem stored edit');
            });
            if (!isArchive) {
                if (highlightedNotifSound) {
                    let audioNotif = new Audio('sound_notif2.aac');
                    audioNotif.volume = 0.5;
                    //// easter-egg ////
                    if (channelInUrl == 'ponce')
                        audioNotif = new Audio('sound_notif_ponce.aac'),
                            audioNotif.volume = 0.7;
                    audioNotif.play();
                }
            }
        } else
            newMessageDiv.setAttribute("data-type", "normal");
        // messageContent.textContent = leMessage;
        let messageFragment = document.createElement('span');
        messageFragment.classList.add("messageFragment");
        messageFragment.textContent = leMessage;
        messageContent.appendChild(messageFragment);
        newMessageDiv.appendChild(messageContent);

        document.getElementById('hightlitedMessageChatContainer').appendChild(newMessageDiv);

        ///// scroll bottom 
        let objDiv = document.getElementById("hightlitedMessageChatContainer");
        if (scollBottom)
            objDiv.scrollTop = objDiv.scrollHeight;

        ////// EMOTES
        let emoteInMessage = extra.messageEmotes;
        console.log(emoteInMessage);
        if (emoteInMessage != null) {
            let emotesName = [];
            let messageTexte = messageFragment.textContent;
            console.log(messageTexte);
            // messageFragment.remove();
            let messageWithEmote = messageTexte;
            for (const [key, value] of Object.entries(emoteInMessage)) {
                for (const [key2, value2] of Object.entries(value)) {
                    let born = value2.split('-');
                    let emoteName = messageTexte.substring(born[0], parseInt(born[1], 10) + 1);

                    // let part1 = messageTexte.substring(0, born[0]);
                    // let part2 = messageTexte.substring(parseInt(born[1], 10) + 1);
                    // console.log(1, part1);
                    // console.log(2, part2);

                    // let span1 = document.createElement('span');
                    // span1.classList.add("messageFragment");
                    // span1.textContent = part1;
                    // messageContent.appendChild(span1);

                    // let emoteImg = document.createElement('img');
                    // emoteImg.src = `https://static-cdn.jtvnw.net/emoticons/v1/${key}/1.0`;
                    // emoteImg.title = emoteName;
                    // emoteImg.alt = emoteName;
                    // emoteImg.classList.add('chat-messageEmote');
                    // messageContent.appendChild(emoteImg);

                    // let span2 = document.createElement('span');
                    // span2.classList.add("messageFragment");
                    // span2.textContent = part2;
                    // messageContent.appendChild(span2);


                    //////////// alede /////////
                    // var element = document.createElement("img");
                    // element.src = `https://static-cdn.jtvnw.net/emoticons/v1/${key}/1.0`;
                    // messageContent.innerHTML= messageTexte.split(emoteName).join(stringToHTML(`<img src="https://static-cdn.jtvnw.net/emoticons/v1/${key}/1.0">`));

                    // function stringToHTML(str) {
                    //     var parser = new DOMParser();
                    //     var doc = parser.parseFromString(str, 'text/html');
                    //     return doc.body;
                    // };
                    ////////////////////////////


                    if (!(emotesName.some(elem => elem === emoteName))) {
                    emotesName.push(emoteName);
                    messageWithEmote = messageWithEmote.replaceAll(emoteName, `</span><img alt="${emoteName}" title="${emoteName}" class="chat-messageEmote" src="https://static-cdn.jtvnw.net/emoticons/v1/${key}/1.0"><span class="messageFragment">`);
                    }
                }
            }
            messageContent.innerHTML = messageWithEmote;
            messageContent.classList.add('chat-message-withEmote');
        }

        ////// Links in message
        // if (linkIsClickable) {
        //     let messageLink = messageContent.innerHTML;
        //     var exp_match = / (\b(https?|):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
        //     messageLink = messageLink.replace(exp_match, ' <a target="_blank" href="$1">$1</a> ');
        //     var new_exp_match = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
        //     messageLink = messageLink.replace(new_exp_match, '$1<a target="_blank" href="http://$2">$2</a>');
        //     messageContent.innerHTML = messageLink;
        // }
        // if (mentionIsColorised) {
        //     let messageMention = messageContent.innerHTML;
        //     let mentionMatch = /(@[a-zA-Z0-9]+)/gim;
        //     console.log(mentionMatch);
        //     messageMention = messageMention.replace(mentionMatch, '<span class="chat-messageMention">$1</span>');
        //     messageContent.innerHTML = messageMention;
        // }

        ///// Delete old message 
        if (deleteOldMessages && scollBottom) {
            while (document.querySelectorAll('.chat-lineMessage[data-type="normal"]').length > 150) {
                document.querySelector('.chat-lineMessage[data-type="normal"]').remove();
            }
        }

        return messageContent;
    }

    /*********************************************************/
    /*                FONCTION GLOBALES - TOOLS              */
    /*********************************************************/
    function hide(selector) {
        document.querySelectorAll(selector).forEach(elem => elem.hidden = true);
    }
    function show(selector) {
        document.querySelectorAll(selector).forEach(elem => elem.hidden = false);
    }
    function remove(selector) {
        document.querySelectorAll(selector).forEach(elem => elem.remove());
    }

}());
