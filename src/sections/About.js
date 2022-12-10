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

            <h3>Blog Posts</h3>
            <p>You can find a discussion of Wordle Clone DSA's <strong><a href='https://devblog.dev/luismartinez/designing-wordle-wordle-clone-dsa-part-i-data-architecture-6defbeea' target="_blank" rel='noreferrer'>data architecture</a></strong> and <strong><a href='https://devblog.dev/luismartinez/designing-wordle-wordle-clone-dsa-part-ii-data-implementation-1d370b6514' target="_blank" rel='noreferrer'>data implementation</a></strong> on this line.
            </p>

            <h3>Performance Tests</h3>
            <p>You can play with some live <strong><a href='https://k2cc2k.csb.app/' target="_blank" rel='noreferrer'>performance tests</a></strong> for Wordle Clone DSA on this line.</p>

            <h3>Code</h3>
            <p>You can find the full code for Wordle Clone in its <strong><a href='https://github.com/mmartinezluis/wordle-clone' target="_blank" rel='noreferrer'>github respository</a></strong>.
            </p>

            <p>Happy coding!!!</p>
            <p>Luis Martinez</p>

        </div>
    )
}

export default About;