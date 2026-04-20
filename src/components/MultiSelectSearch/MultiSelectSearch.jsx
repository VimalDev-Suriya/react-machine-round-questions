import { useEffect, useRef, useState } from 'react';
import './MultiSelectSearch.scss';
import { UserService } from '../../services/UserService';

const MultiSelectSearch = () => {
    const [inputValue, setInputValue] = useState('');
    const [usersList, setUsersList] = useState({
        data: null,
        loading: false,
        error: null
    });
    const [pills, setPills] = useState(new Set([]));
    const focusInput = useRef(null);

    useEffect(() => {
        if (inputValue) {
            const getProducts = async () => {
                setUsersList(prev => ({
                    ...prev,
                    loading: true
                }))
                try {
                    const users = await new UserService().getUsers();
                    setUsersList(prev => ({
                        ...prev,
                        data: users
                    }))

                } catch (error) {
                    setUsersList(prev => ({
                        ...prev,
                        error
                    }))

                } finally {
                    setUsersList(prev => ({
                        ...prev,
                        loading: false
                    }))

                }


            }
            // API Call

            getProducts();
        }
    }, [inputValue])

    const handleInput = e => {
        setInputValue(e.target.value)
    }

    const handleSelect = (name) => {
        setPills(prev => {
            return new Set([...prev, name]);
        })
        setInputValue('');
        setUsersList((prev) => ({
            ...prev,
            data: null
        }))
        focusInput.current.focus();
    }

    const removePill = (name) => {
        setPills(prev => {
            const filteredValues = [...prev].filter(n => n !== name);
            return new Set(filteredValues);
        })
    }

    const handleKeydown = (e) => {
        if (e.key === "Backspace") {
            setPills(prev => {
                const filteredValues = [...prev]
                filteredValues.pop();
                return new Set(filteredValues);
            })
        }
    }

    return <div className="multiselect-container">
        {/* Pills */}
        <div className='pills'>
            {
                Array.from(pills).map(pill => {
                    return <span key={pill} onClick={() => removePill(pill)}>{pill}</span>
                })
            }
        </div>
        {/* Input */}
        <input
            name="multi-select-input"
            value={inputValue}
            type='text'
            placeholder='Find the Group'
            onChange={handleInput}
            ref={focusInput}
            onKeyDown={handleKeydown}
        />

        {/* Suggestions */}
        <div className='suggestion-list'>
            {usersList.error && <div>Some Error</div>}
            {usersList.loading && <div>Loading...</div>}

            {usersList.data &&
                <ul>
                    {
                        usersList.data.map(user => {
                            if (user.username.includes(inputValue) && !pills.has(user.username)) {
                                return <li
                                    key={user.email}
                                    onClick={() => handleSelect(user.username)}
                                >{user.username}</li>
                            }

                            return null;
                        })
                    }
                </ul>
            }
        </div>
    </div>
}

export default MultiSelectSearch