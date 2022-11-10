import React from 'react';

const About = () => {
    return(
        <div className='about'>
            <h2>About</h2>
            <p>I created <strong>Wordle Clone</strong> with the goal of implementing <strong>Data Structures and Algorithms</strong> (WCDSA) to real-world scenarios,
                and as a means of writing efficient code in practice. Wordle Clone utilizes a combination of a matrix and 
                queue data structures and a counter variable to access user input in constant time at any given 
                time during the game. This combination also allows to more easily implement special features, such as
                specific-cell editing.
            </p>
            <p>As simple as it may seem, Wordle Clone came with many interesting challenges that helped me 
                become a better problem solver and developer.
            </p>
            <p>Wordle Clone is playable in desktop and mobile. </p>

            <p>You can find a discussion of Wordle Clone DSA's data architecture 
                in my blog post <strong><a href='https://devblog.dev/posts/215' target="_blank" rel='noreferrer'><em>Designing Wordle: Wordle Clone DSA Part I: Data Architecture</em></a></strong>.
                You can find the full code for Wordle Clone in its <strong><a href='https://github.com/mmartinezluis/wordle-clone' target="_blank" rel='noreferrer'>github respository</a></strong>.
            </p>

            <p>Happy coding!!!</p>
            <p>Luis Martinez</p>

        </div>
    )
}

export default About;